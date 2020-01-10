import React from 'react';
import ReactDOM from 'react-dom';
import {combine} from 'effector';
import {DbContext} from '@/contexts/dbContext';
import {addLogEntry} from '@/stores/logsStore';
import {$rules, $hasRules, fetchRules} from '@/stores/rulesStore';
import {$debuggerEnabled, $debuggerActive, setDebuggerEnabled, setDebuggerActive, setDebuggerSwitching, setPanelShown} from '@/stores/uiStore'; // prettier-ignore
import {openIDB, RulesMapper} from '@/services/indexedDB';
import {ExtensionDevtoolsConnector, ExtensionTab, ExtensionIcon} from '@/services/extension';
import {FetchDevtools, FetchRuleStore} from '@/services/devtools/fetch';
import {getPlatform} from '@/helpers/browser';
import {App} from '@/components/app';
import '@/style/page.css';

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

	// Delivery the rules form the main store to the devtools
	$rules.watch(rules => fetchRulesStore.setRulesList(rules));

	// Load rules from database
	await fetchRules({dbRulesMapper});

	// Connect devtools and store by events model
	devtools.userDetachEvent.on(() => {
		setDebuggerEnabled(false);
		setDebuggerActive(false);
	});
	fetchDevtools.events.requestProcessed.on(addLogEntry);

	// Synchronize Fetch devtools activity value with the ui state and the extension icon
	combine([$hasRules, $debuggerEnabled])
		// Debugger is allowed if there is at least one rule and its enabled by an user
		.map(conditions => conditions.every(Boolean))
		.watch(async function manageDebuggerActive(isAllowed: boolean) {
			// TODO disallow switch state when previous operation during
			setDebuggerSwitching(true);

			const debuggerActive = $debuggerActive.getState();
			if (isAllowed && !debuggerActive) {
				await devtools.initialize();
				await fetchDevtools.enable();
				extIcon.makeActive();
				setDebuggerActive(true);
			} else if (!isAllowed && debuggerActive) {
				await fetchDevtools.disable();
				if (devtools.isAttached) {
					await devtools.destroy();
				}
				extIcon.makeInactive();
				setDebuggerActive(false);
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
