import React from 'react';
import ReactDOM from 'react-dom';
import {combine} from 'effector';
import {DbContext} from '@/contexts/dbContext';
import {addLogEntry} from '@/stores/logsStore';
import {$rules, $hasActiveRules, fetchRules} from '@/stores/rulesStore';
import {$debuggerEnabled, $debuggerActive, setDebuggerEnabled, setDebuggerActive, setDebuggerSwitching, setPanelShown} from '@/stores/uiStore'; // prettier-ignore
import {openIDB, RulesMapper} from '@/services/indexedDB';
import {ExtensionDevtoolsConnector, ExtensionTab, ExtensionIcon} from '@/services/extension';
import {FetchDevtools, FetchRuleStore} from '@/services/devtools/fetch';
import {getPlatform} from '@/helpers/browser';
import {App} from '@/components/app';
import '@/style/page.css';

// TODO Render раньше

(async () => {
	// Get the current tab id, url and hostname
	const {tabId} = chrome.devtools.inspectedWindow;
	const tabUrl = await new ExtensionTab(tabId).getUrl();
	const tabHost = new URL(tabUrl).hostname;

	// Open indexed db connection
	let dbConnection = await openIDB();

	try {
		dbConnection = await openIDB();
	} catch (error) {
		// TODO test working after exception
		console.error('Exception on open IndexedDB', error);
	}

	// Initialize db data mappers
	const dbRulesMapper = new RulesMapper(dbConnection, tabHost);

	// Initialize devtools
	const devtools = new ExtensionDevtoolsConnector(tabId);
	const extIcon = new ExtensionIcon(tabId, 'Netify');
	const fetchRulesStore = new FetchRuleStore();
	const fetchDevtools = new FetchDevtools(devtools, fetchRulesStore);

	// Load rules from database
	await fetchRules({dbRulesMapper});

	// Connect devtools and store by events model
	devtools.userDetachEvent.on(() => {
		setDebuggerEnabled(false);
		setDebuggerActive(false);
	});

	// Delivery logs from devtools to the application store
	fetchDevtools.events.requestProcessed.on(addLogEntry);

	// Debugger is allowed if there is at least one active rule and its enabled by an user
	const $debuggerAllowed = combine([$hasActiveRules, $debuggerEnabled]).map(conditions => conditions.every(Boolean));

	// Synchronize Fetch devtools activity value with the ui state and the extension icon
	combine({rules: $rules, debuggerAllowed: $debuggerAllowed}).watch(async function({rules, debuggerAllowed}) {
		// TODO disallow switch state when previous operation during

		setDebuggerSwitching(true);
		fetchRulesStore.setRulesList(rules);

		const debuggerActive = $debuggerActive.getState();
		if (debuggerAllowed && !debuggerActive) {
			// Switch on
			await devtools.initialize();
			await fetchDevtools.enable();
			extIcon.makeActive();
			setDebuggerActive(true);
		} else if (!debuggerAllowed && debuggerActive) {
			// Switch off
			await fetchDevtools.disable();
			if (devtools.isAttached) {
				await devtools.destroy();
			}
			extIcon.makeInactive();
			setDebuggerActive(false);
		} else {
			// Update the rules list and restart the fetch devtools service
			await fetchDevtools.restart();
		}

		setDebuggerSwitching(false);
	});

	// Detach debugger on page leave
	self.addEventListener('beforeunload', () => {
		if ($debuggerActive.getState()) {
			fetchDevtools.disable();
			devtools.destroy();
			extIcon.makeInactive();
		}
	});

	// Save panes shown state
	(chrome.extension as any).onMessage.addListener((message: {type: string; shown?: boolean}) => {
		if (message.type === 'panelShowToggle') {
			setPanelShown(!!message.shown);
		}
	});

	// Define current platform styles
	const platform = getPlatform();
	document.querySelector('body')!.classList.add(`platform-${platform}`);

	// Render the application UI
	const appElement = React.createElement(App);
	const appWithStore = React.createElement(DbContext.Provider, {value: {dbRulesMapper}}, appElement);
	ReactDOM.render(appWithStore, document.getElementById('app-root'));
})();
