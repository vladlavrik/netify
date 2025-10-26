import React from 'react';
import {createRoot} from 'react-dom/client';
import {autorun, reaction, toJS} from 'mobx';
import {RuntimeMessage} from '@/interfaces/runtimeMessage';
import {RuntimeMode} from '@/interfaces/runtimeMode';
import {FetchDevtools, FetchRuleStore} from '@/services/devtools/fetch';
import {RequestListener} from '@/services/devtools/RequestListener';
import {ExtensionDevtoolsConnector, ExtensionIcon, ExtensionTabManager} from '@/services/extension';
import {getPlatform} from '@/helpers/browser';
import {randomHex} from '@/helpers/random';
import {RootStore} from '@/stores/RootStore';
import {StoresContext} from '@/stores/StoresContext';
import {App} from '@/components/app';

export class ApplicationManager {
	private appInstanceId = randomHex(8);

	constructor(
		private readonly runtimeMode: RuntimeMode,
		private readonly tabId: number,
		private readonly tabManager: ExtensionTabManager,
		private readonly extensionIcon: ExtensionIcon,
		private readonly devtoolsConnector: ExtensionDevtoolsConnector,
		private readonly fetchRulesStore: FetchRuleStore,
		private readonly fetchDevtools: FetchDevtools,
		private readonly requestListener: RequestListener,
		private readonly rootStore: RootStore,
	) {}

	async initialize() {
		// Render the UI
		this.prepareUI();
		this.renderUI();

		this.reportAppInstanceOpen();

		// Prepare the data
		await this.determineTargetTab();
		await this.readSettings();
		await this.fetchRulesFromDatabase();
		this.actualizeRulesList();

		// Initialize the main business logic
		this.serveRequestInterceptor();
		this.serveRequestListener();
		this.serveDebuggerState();
		this.serveDebuggerConnect();

		// Provide communication between internal services and external environment
		this.listenRulesUpdate();
		this.listenBreakpoints();
		this.listenLogs();
		this.listenTabUpdates();
		this.listenPopupTitleUpdate();

		this.detachOnUnload();
	}

	/**
	 * Report to the background script (service worker) the app instance open
	 */
	private async reportAppInstanceOpen() {
		chrome.runtime.sendMessage<RuntimeMessage>({
			name: 'registerInstance',
			tabId: this.tabId,
			instanceType: this.runtimeMode,
			instanceId: this.appInstanceId,
		});
	}

	/**
	 * Read the settings from the persistence store
	 */
	private async readSettings() {
		await this.rootStore.settingsStore.fetchValues();
	}

	/**
	 * Define the target (request on which one will be intercepted) tab
	 */
	private async determineTargetTab() {
		const targetTab = await this.tabManager.getTabById(this.tabId);
		if (!targetTab) {
			throw new Error(`No active tab with id ${this.tabId} found`);
		}

		this.rootStore.tabStore.setTargetTab(targetTab);
	}

	/**
	 * Fetch to the store the rules list from a persistence storage
	 */
	private async fetchRulesFromDatabase() {
		await this.rootStore.rulesStore.fetchRules();
	}

	/**
	 * Re-fetch an actual rules list on change a value of the current origin or an origin filtering is active in the store
	 */
	private actualizeRulesList() {
		const {tabStore, rulesStore} = this.rootStore;
		reaction(
			() => [tabStore.targetTabUrlOrigin, rulesStore.filterByOrigin],
			this.fetchRulesFromDatabase.bind(this),
		);
	}

	/**
	 * Determines general UI appearance and styles like color scheme and font family
	 */
	private prepareUI() {
		// Set app UI store values
		this.rootStore.appUiStore.setRuntimeMode(this.runtimeMode);

		// Define current platform styles
		const platform = getPlatform();
		document.querySelector('body')!.classList.add(`platform-${platform}`);

		// Define a color theme and watch its update
		autorun(() => {
			const {uiTheme} = this.rootStore.settingsStore;
			document.documentElement.classList.remove('theme-dark', 'theme-light');
			if (uiTheme === 'dark') {
				document.documentElement.classList.add('theme-dark');
			} else if (uiTheme === 'light') {
				document.documentElement.classList.add('theme-light');
			}
		});
	}

	private renderUI() {
		const rootContainer = document.getElementById('app-root')!;
		const root = createRoot(rootContainer);

		const appElement = React.createElement(App);
		const appWithStore = React.createElement(StoresContext.Provider, {value: this.rootStore}, appElement);
		root.render(appWithStore);
	}

	/**
	 * Serve a connection to the debugger (browser devtools) connection
	 */
	serveDebuggerConnect() {
		const {debuggerStateStore, tabStore} = this.rootStore;
		reaction(
			() => ({
				debuggingAllowed: debuggerStateStore.enabled && tabStore.targetTabHasPage,
				tabId: tabStore.targetTab?.id,
			}),
			async ({debuggingAllowed, tabId}) => {
				const debuggerState = this.devtoolsConnector.status.type;
				if (debuggingAllowed && debuggerState === 'disconnected') {
					// Switch on
					try {
						await this.devtoolsConnector.connect(tabId!);
					} catch (error) {
						this.rootStore.errorLogsStore.addLogEntry({
							title: 'Chrome devtools connect error',
							error,
						});
						throw error;
					}
				} else if (!debuggingAllowed && debuggerState === 'connected') {
					// Switch off
					if (this.devtoolsConnector.status.type === 'connected') {
						try {
							await this.devtoolsConnector.disconnect();
						} catch (error) {
							console.error(error);
						}
					}
				} else if (debuggingAllowed && debuggerState === 'connected') {
					// Reconnect with a new tab
					try {
						await this.devtoolsConnector.disconnect();
					} catch (error) {
						console.error(error);
					}
					await this.devtoolsConnector.connect(tabId!);
				}
			},
			{fireImmediately: true},
		);
	}

	/**
	 * Listen to devtool connection state and display it in the app state
	 */
	serveDebuggerState() {
		const {debuggerStateStore} = this.rootStore;
		this.devtoolsConnector.activeStateChangeEvent.on(async (state) => {
			// Serve Fetcher service to enable requests handling by rules
			switch (state.type) {
				case 'connecting':
				case 'disconnecting':
					debuggerStateStore.setSwitching(true);
					break;

				case 'connected':
					this.extensionIcon.makeActive();
					debuggerStateStore.setActive(true);
					debuggerStateStore.setSwitching(false);
					break;

				case 'disconnected':
					this.extensionIcon.makeInactive();
					if (debuggerStateStore.enabled) {
						debuggerStateStore.setEnabled(false);
					}
					debuggerStateStore.setActive(false);
					debuggerStateStore.setSwitching(false);

					chrome.runtime.sendMessage({
						name: 'netifyDevtoolConnectStateChanged',
						active: false,
					});
					break;
			}
		});
	}

	/**
	 * Serve (enable/disable) the request interceptor service
	 */
	serveRequestInterceptor() {
		this.devtoolsConnector.activeStateChangeEvent.on((state) => {
			if (state.type === 'connected' || state.type === 'disconnected') {
				this.actualizeRequestInterceptorState();
			}
		});
	}

	/**
	 * Serve (enable/disable) the request interceptor service
	 */
	serveRequestListener() {
		this.devtoolsConnector.activeStateChangeEvent.on((state) => {
			if (state.type === 'connected') {
				this.requestListener.enable();
			} else if (state.type === 'disconnected') {
				this.requestListener.disable();
			}
		});
	}

	/**
	 * Enable/disable and restart request interceptors on rules list update
	 */
	listenRulesUpdate() {
		const {tabStore, rulesStore, debuggerStateStore} = this.rootStore;

		reaction(
			() => ({
				currentOrigin: tabStore.targetTabUrlOrigin,
				rules: toJS(rulesStore.list), // Used "list" instead of "activeRules" to workaround mobx bug: reaction not fired
			}),
			() => {
				if (!debuggerStateStore.switching) {
					this.actualizeRequestInterceptorState();
				}
			},
		);
	}

	/**
	 * Set the actual state of request interceptors enabling and set actual rules list
	 */
	async actualizeRequestInterceptorState() {
		const {tabStore, rulesStore} = this.rootStore;
		if (rulesStore.listFetching || this.devtoolsConnector.status.type === 'connecting') {
			return;
		}

		const shouldBeEnabled = this.devtoolsConnector.status.type === 'connected' && rulesStore.hasActiveRules;

		// Disable request intercepting
		if (!shouldBeEnabled) {
			if (this.fetchDevtools.enabled) {
				await this.fetchDevtools.disable();
				this.fetchRulesStore.reset();
			}
			return;
		}

		// Enable/restart request intercepting
		if (this.fetchDevtools.enabled) {
			await this.fetchDevtools.disable();
		}
		const rules = rulesStore.activeRules.map((item) => toJS(item));
		this.fetchRulesStore.setCurrentOrigin(tabStore.targetTabUrlOrigin!);
		this.fetchRulesStore.setRulesList(rules);
		await this.fetchDevtools.enable();
	}

	/**
	 * Listen request events to add a log entry
	 */
	private listenLogs() {
		this.fetchDevtools.events.requestProcessed.on((log) => {
			this.rootStore.networkLogsStore.addLogEntry(log);
		});

		this.fetchDevtools.events.requestScriptHandleException.on(({title, error}) => {
			this.rootStore.errorLogsStore.addLogEntry({title: `[Script execution error] ${title}`, error});
		});
	}

	/**
	 * Listen request's breakpoints emit to show them in the UI.
	 */
	private listenBreakpoints() {
		this.fetchDevtools.events.requestBreakpoint.on((breakpoint) => {
			this.rootStore.breakpointsStore.addBreakpoint(breakpoint);
		});

		reaction(
			() => this.rootStore.debuggerStateStore.active,
			(isActive) => {
				if (!isActive && this.rootStore.breakpointsStore.hasBreakpoint) {
					this.rootStore.breakpointsStore.resetList();
				}
			},
		);
	}

	/**
	 * Listen to the target tab updates to map it in the store
	 */
	private listenTabUpdates() {
		const {tabStore} = this.rootStore;

		// Collect taget tab changes
		this.tabManager.tabUpdateEvent.on((changes) => {
			tabStore.updateTargetTab(changes);
		});

		// Remove the popup when the target tab is closed
		this.tabManager.tabRemoveEvent.on(() => {
			if (this.runtimeMode === 'popup') {
				window.close();
			}
		});
	}

	private listenPopupTitleUpdate() {
		autorun(() => {
			const targetTab = this.rootStore.tabStore.targetTab;
			if (targetTab) {
				document.title = `Netify | ${targetTab.title || targetTab.url}`;
			}
		});
	}

	/**
	 * Detach debugger on the page leave
	 */
	private detachOnUnload() {
		self.addEventListener('beforeunload', () => {
			chrome.runtime.sendMessage<RuntimeMessage>({
				name: 'unregisterInstance',
				tabId: this.tabId,
				instanceType: this.runtimeMode,
				instanceId: this.appInstanceId,
			});

			if (this.rootStore.debuggerStateStore.active) {
				this.extensionIcon.makeInactive();
				this.devtoolsConnector.disconnect();
			}
		});
	}
}
