import React from 'react';
import ReactDOM from 'react-dom';
import {combine} from 'effector';
import {DbContext} from '@/contexts/dbContext';
import {addLogEntry} from '@/stores/logsStore';
import {$rules, $hasActiveRules, fetchRules} from '@/stores/rulesStore';
import {$debuggerEnabled, $debuggerActive, $useRulesPerDomain, setDebuggerEnabled, setDebuggerActive, setDebuggerSwitching, setPanelShown} from '@/stores/uiStore'; // prettier-ignore
import {openIDB, RulesMapper} from '@/services/indexedDB';
import {ExtensionDevtoolsConnector, ExtensionTab, ExtensionIcon} from '@/services/extension';
import {FetchDevtools, FetchRuleStore} from '@/services/devtools/fetch';
import {getPlatform} from '@/helpers/browser';
import {App} from '@/components/app';
import '@/style/page.css';

class PanelApplication {
	private tabId = chrome.devtools.inspectedWindow.tabId;
	private tab = new ExtensionTab(this.tabId);

	private tabOrigin!: string;
	private db!: IDBDatabase;
	private rulesMapper!: RulesMapper;

	extIcon = new ExtensionIcon(this.tabId, 'Netify');
	devtools = new ExtensionDevtoolsConnector(this.tabId);
	fetchRulesStore = new FetchRuleStore();
	fetchDevtools = new FetchDevtools(this.devtools, this.fetchRulesStore);

	constructor() {
		this.initialize().catch(error => {
			// TODO handle the error
			throw error;
		});
	}

	private async initialize() {
		// Delivery logs from the devtools to the application store
		this.fetchDevtools.events.requestProcessed.on(addLogEntry);

		// Make devtools inactive on an external used's detach
		this.devtools.userDetachEvent.on(this.makeDevtoolsDisabled);

		// Detach debugger on the page leave
		self.addEventListener('beforeunload', this.forcedDevtoolsDisable);

		// Listen to external (in extension) events
		chrome.runtime.onMessage.addListener(this.handleExtensionEvents);

		// Re-fetch the rules list on a browser tab hostname changed
		this.tab.pageUrlChangeEvent.on(this.handleTabUrlChange);

		// Re-fetch the rules list when user switch on/off rules list per domain
		$useRulesPerDomain.updates.watch(this.fetchRules);

		// Require the current browser's tab hostname
		const tabUrl = await this.tab.getPageUrl();
		this.tabOrigin = tabUrl.origin;

		this.fetchRulesStore.setCurrentOrigin(this.tabOrigin);

		this.defineUIEnvironment();
		await this.prepareDatabase();
		await this.fetchRules();
		this.renderUI();
		this.initializeDevtools();
	}

	private makeDevtoolsDisabled() {
		// Make devtools inactive on external used's detach
		setDebuggerEnabled(false);
		setDebuggerActive(false);
	}

	private forcedDevtoolsDisable = () => {
		if ($debuggerActive.getState()) {
			this.fetchDevtools.disable();
			this.devtools.destroy();
			this.extIcon.makeInactive();
		}
	};

	private handleExtensionEvents = (message: any) => {
		if (typeof message !== 'object') {
			return;
		}

		switch (message.type) {
			case 'panelShowToggle':
				setPanelShown(!!message.shown);
		}
	};

	private handleTabUrlChange = async ({url: {origin}, originChanged}: {url: URL; originChanged: boolean}) => {
		if (!originChanged) {
			return;
		}

		this.rulesMapper.defineOrigin(origin);

		// Load a new rules list for the new domain
		if ($useRulesPerDomain.getState()) {
			await fetchRules({rulesMapper: this.rulesMapper, perCurrentHostname: true});
		}

		// Report a new current tab url a devtool for compare request with related urls
		if ($debuggerActive.getState()) {
			this.fetchRulesStore.setCurrentOrigin(origin);
			await this.fetchDevtools.restart();
		}
	};

	private async prepareDatabase() {
		try {
			this.db = await openIDB();
		} catch (error) {
			// TODO test working after exception
			console.error('Exception on open IndexedDB', error);
		}

		// Initialize db data mappers
		this.rulesMapper = new RulesMapper(this.db, this.tabOrigin);
	}

	private fetchRules = async () => {
		const {rulesMapper} = this;
		const perCurrentHostname = $useRulesPerDomain.getState();
		await fetchRules({rulesMapper, perCurrentHostname});
	};

	private initializeDevtools() {
		// Debugger is allowed if there is at least one active rule and its enabled by an user
		const $debuggerAllowed = combine([$hasActiveRules, $debuggerEnabled]).map(conditions =>
			conditions.every(Boolean),
		);

		// Synchronize Fetch devtools activity value with the ui state and the extension icon
		combine({rules: $rules, debuggerAllowed: $debuggerAllowed}).watch(async ({rules, debuggerAllowed}) => {
			// TODO disallow to switch state when previous operation during
			setDebuggerSwitching(true);
			this.fetchRulesStore.setRulesList(rules);

			const debuggerActive = $debuggerActive.getState();
			if (debuggerAllowed && !debuggerActive) {
				// Switch on
				await this.devtools.initialize();
				await this.fetchDevtools.enable();
				this.extIcon.makeActive();
				setDebuggerActive(true);
			} else if (!debuggerAllowed && debuggerActive) {
				// Switch off
				await this.fetchDevtools.disable();
				if (this.devtools.isAttached) {
					await this.devtools.destroy();
				}
				this.extIcon.makeInactive();
				setDebuggerActive(false);
			} else {
				// Update the rules list and restart the fetch devtools service
				await this.fetchDevtools.restart();
			}

			setDebuggerSwitching(false);
		});
	}

	private defineUIEnvironment() {
		// Define current platform styles
		const platform = getPlatform();
		document.querySelector('body')!.classList.add(`platform-${platform}`);

		// Define a theme
		if ((chrome.devtools.panels as any).themeName === 'dark') {
			document.documentElement.classList.add('dark-theme');
		}
	}

	private renderUI() {
		const {rulesMapper} = this;
		const appElement = React.createElement(App);
		const appWithStore = React.createElement(DbContext.Provider, {value: {rulesMapper}}, appElement);
		ReactDOM.render(appWithStore, document.getElementById('app-root'));
	}
}

new PanelApplication();
