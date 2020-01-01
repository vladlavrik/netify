import React from 'react';
import ReactDOM from 'react-dom';
import {autorun, toJS} from 'mobx';
import {Provider} from 'mobx-react';
import {RootStore} from '@/stores/RootStore';
import {ExtensionDevtoolsConnector, ExtensionTab, ExtensionIcon} from '@/services/extension';
import {FetchDevtools, FetchRuleStore} from '@/services/devtools/fetch';
import {getPlatform} from '@/helpers/browser';
import {App} from '@/components/App';
import '@/style/page.css';

(async () => {
	const {tabId} = chrome.devtools.inspectedWindow;

	// Get current tab url
	const tabUrl = await new ExtensionTab(tabId).getUrl();

	// Initialize a store
	const store = new RootStore();

	// Load persistence saved rules
	await store.rulesStore.initialize(tabUrl);

	// Initialize devtools
	const devtools = new ExtensionDevtoolsConnector(tabId);
	const extIcon = new ExtensionIcon(tabId, 'Netify');
	const fetchRulesStore = new FetchRuleStore();
	const fetchDevtools = new FetchDevtools(devtools, fetchRulesStore);

	// TODO comment me
	autorun(() => {
		fetchRulesStore.setRulesList(toJS(store.rulesStore.list));
	});

	// Connect devtools and store by events model
	devtools.userDetachEvent.on(() => store.appStore.disableDebugger());
	fetchDevtools.events.requestStart.on(log => store.logsStore.add(log));
	fetchDevtools.events.requestEnd.on(id => store.logsStore.makeLoaded(id));

	// TODO comment me
	let debuggerActive = false;
	autorun(async () => {
		// TODO disallow switch state when previous operation during
		const {debuggerAllowed} = store.appStore;
		const hasRules = store.rulesStore.list.length > 0;

		if (hasRules && !debuggerActive && debuggerAllowed) {
			await devtools.initialize();
			await fetchDevtools.enable();
			extIcon.makeActive();
			debuggerActive = true;
			return;
		}

		if (!(hasRules && debuggerAllowed) && debuggerActive) {
			await fetchDevtools.disable();
			if (devtools.isAttached) {
				await devtools.destroy();
			}
			extIcon.makeInactive();
			debuggerActive = false;
		}
	});

	// Detach debugger on page leave
	self.addEventListener('beforeunload', () => {
		if (debuggerActive) {
			fetchDevtools.disable();
			devtools.destroy();
			extIcon.makeInactive();
		}
	});

	// Save panes shown state
	(chrome.extension as any).onMessage.addListener((message: {type: string; shown?: boolean}) => {
		if (message.type === 'panelShowToggle') {
			store.appStore.setPanelShown(!!message.shown);
		}
	});

	// Define current platform styles
	const platform = getPlatform();
	document.querySelector('body')!.classList.add(`platform-${platform}`);

	// Render the application UI
	const appElement = React.createElement(App);
	const appWithStoreElement = React.createElement(
		Provider,
		{
			appStore: store.appStore,
			rulesStore: store.rulesStore,
			logsStore: store.logsStore,
		},
		appElement,
	);

	ReactDOM.render(appWithStoreElement, document.getElementById('app-root'));
})();
