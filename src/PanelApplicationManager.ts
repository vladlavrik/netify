import React from 'react';
import ReactDOM from 'react-dom';
import {reaction, toJS} from 'mobx';
import {Rule} from '@/interfaces/rule';
import {FetchDevtools, FetchRuleStore} from '@/services/devtools/fetch';
import {ExtensionDevtoolsConnector, ExtensionIcon, ExtensionTab} from '@/services/extension';
import {getPlatform} from '@/helpers/browser';
import {App} from '@/components/app';
import {RootStore} from '@/stores/RootStore';
import {StoresContext} from '@/stores/StoresContext';

export class PanelApplicationManager {
	constructor(
		private readonly tab: ExtensionTab,
		private readonly extensionIcon: ExtensionIcon,
		private readonly devtoolsConnector: ExtensionDevtoolsConnector,
		private readonly fetchRulesStore: FetchRuleStore,
		private readonly fetchDevtools: FetchDevtools,
		private readonly rootStore: RootStore,
		private readonly tabOrigin: string,
	) {}

	async initialize() {
		// Prepare data layer
		this.setTabOrigin(this.tabOrigin);

		// Render the UI
		this.prepareUI();
		this.renderUI();

		await this.fetchRulesFromDatabase();
		this.actualizeRulesList();

		// Start debugging if it is allowed
		this.actualizeDebuggerState();

		// Provide communication between internal services and external environment
		this.listenBreakpoints();
		this.listenLogs();
		this.listenTabOriginChange();
		this.listenExtensionEvents();
		this.listenUserDevtoolsDetach();
		this.listenUnload();
	}

	/**
	 * Define a new tab url origin to the application store and to the rules store
	 */
	private setTabOrigin(origin: string) {
		this.rootStore.rulesStore.setCurrentOrigin(origin);
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
		const {rulesStore} = this.rootStore;
		reaction(() => [rulesStore.currentOrigin, rulesStore.filterByOrigin], this.fetchRulesFromDatabase.bind(this));
	}

	/**
	 * Determines a UI color scheme value from the user's devtools setting and define the value for the panel page
	 */
	private prepareUI() {
		// Define current platform styles
		const platform = getPlatform();
		document.querySelector('body')!.classList.add(`platform-${platform}`);

		// Define a theme
		const setTheme = () => {
			const {themeName} = chrome.devtools.panels;
			if (themeName === 'dark') {
				document.documentElement.classList.add('dark-theme');
			} else {
				document.documentElement.classList.remove('dark-theme');
			}

			this.rootStore.appUiStore.setThemeName(themeName);
		};

		setTheme();
		if ('setThemeChangeHandler' in chrome.devtools.panels) {
			(chrome.devtools.panels as any).setThemeChangeHandler(setTheme);
		}
	}

	private renderUI() {
		const appElement = React.createElement(App);
		const appWithStore = React.createElement(StoresContext.Provider, {value: this.rootStore}, appElement);
		ReactDOM.render(appWithStore, document.getElementById('app-root'));
	}

	/**
	 * Starts or stops network debugging depending on the user's permission state and the presence of active rules
	 * It also restarts the debugger when the rules change.
	 */
	private actualizeDebuggerState() {
		const {debuggerStateStore, rulesStore} = this.rootStore;

		reaction(
			() => ({
				debuggingEnabled: debuggerStateStore.enabled,
				currentOrigin: rulesStore.currentOrigin,
				rules: toJS(rulesStore.list), // Used "list" instead of "activeRules" to workaround mobx bug: reaction not fired
			}),
			async ({debuggingEnabled, currentOrigin}) => {
				const rules = rulesStore.activeRules.map((item) => toJS(item));
				const debuggingActive = debuggerStateStore.active;
				const debuggingShouldBeActive = debuggingEnabled && rules.length !== 0;

				debuggerStateStore.setSwitching(true);
				if (debuggingShouldBeActive && !debuggingActive) {
					// Switch on
					await this.enableDebugging(rules, currentOrigin);
				} else if (!debuggingShouldBeActive && debuggingActive) {
					// Switch off
					await this.disableDebugging();
				} else if (debuggingActive) {
					// Update the rules list and restart debugging service
					this.fetchRulesStore.setCurrentOrigin(currentOrigin);
					this.fetchRulesStore.setRulesList(rules);
					await this.fetchDevtools.restart();
				}
				debuggerStateStore.setSwitching(false);
			},
			{
				fireImmediately: true,
			},
		);
	}

	private async enableDebugging(rules: Rule[], currentOrigin: string) {
		this.fetchRulesStore.setRulesList(rules);
		this.fetchRulesStore.setCurrentOrigin(currentOrigin);
		await this.devtoolsConnector.initialize();
		await this.fetchDevtools.enable();
		this.extensionIcon.makeActive();
		this.rootStore.debuggerStateStore.setActive(true);
	}

	private async disableDebugging() {
		await this.fetchDevtools.disable();
		if (this.devtoolsConnector.isAttached) {
			await this.devtoolsConnector.destroy();
		}
		this.fetchRulesStore.reset();
		this.extensionIcon.makeInactive();
		this.rootStore.debuggerStateStore.setActive(false);
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
	 * Listen request breakpoints emit to show it in the UI.
	 * Also listen debugger
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
	 * Listen the tab navigation to update the tab's url origin value in the store and re-fetch an actual rules list
	 */
	private listenTabOriginChange() {
		// Put updated page url origin to the store
		this.tab.pageUrlChangeEvent.on(({url, originChanged}) => {
			if (originChanged) {
				this.setTabOrigin(url.origin);
			}
		});
	}

	/**
	 * Listen to external (in scope of the extension) events
	 */
	private listenExtensionEvents() {
		chrome.runtime.onMessage.addListener((message) => {
			if (typeof message !== 'object') {
				return;
			}

			if (message.tabId !== chrome.devtools.inspectedWindow.tabId) {
				return;
			}

			switch (message.type) {
				case 'panelShowChange':
					this.rootStore.appUiStore.setPanelActive(!!message.shown);
					break;
			}
		});
	}

	/**
	 * Make debugging inactive on external detach by a user
	 */
	private listenUserDevtoolsDetach() {
		this.devtoolsConnector.userDetachEvent.on(() => {
			this.rootStore.debuggerStateStore.setEnabled(false);
			this.rootStore.debuggerStateStore.setActive(false);
		});
	}

	/**
	 * Detach debugger on the page leave
	 */
	private listenUnload() {
		self.addEventListener('beforeunload', () => {
			if (!this.rootStore.debuggerStateStore.active) {
				return;
			}

			this.fetchDevtools.disable();
			this.devtoolsConnector.destroy();
			this.extensionIcon.makeInactive();
		});
	}
}
