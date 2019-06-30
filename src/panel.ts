import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {autorun} from 'mobx';
import {Provider} from 'mobx-react';
import {RootStore} from '@/stores/RootStore';
import {Debugger, DebuggerState, getTargetTabUrl} from '@/debugger';
import {getPlatfom} from '@/helpers/browser';
import {Log} from '@/interfaces/Log';
import {App} from '@/components/App';
import '@/style/page.css';

(async () => {
	// Get current tab url
	const tabUrl = await getTargetTabUrl();

	// Initialize a store
	const store = new RootStore();

	// Load saved rules
	await store.rulesStore.initialize(tabUrl);

	// Initialize debugger
	const dbg = new Debugger({
		tabId: chrome.devtools.inspectedWindow.tabId,
		rulesSelector: store.rulesStore,

		onRequestStart(log: Log) {
			store.logsStore.add(log);
		},

		onRequestEnd(id: string) {
			store.logsStore.makeLoaded(id);
		},

		onUserDetach() {
			store.appStore.disableDebugger();
		},
	});

	// TODO comment me
	autorun(async () => {
		// TODO disallow switch state when previous operation during
		const debuggerActive = [DebuggerState.Active, DebuggerState.Starting].includes(dbg.currentState);
		const {debuggerAllowed} = store.appStore;
		const hasRules = store.rulesStore.list.length > 0;

		if (hasRules && !debuggerActive && debuggerAllowed) {
			await dbg.initialize();
			return;
		}

		if (!(hasRules && debuggerAllowed) && debuggerActive) {
			await dbg.destroy();
		}
	});

	// TODO comment me
	self.addEventListener('beforeunload', async () => {
		if ([DebuggerState.Active, DebuggerState.Starting].includes(dbg.currentState)) {
			await dbg.destroy();
		}
	});

	// Define current platform styles
	const platform = getPlatfom();
	document.querySelector('body')!.classList.add('platform-' + platform);

	// Render the application
	const appElement = React.createElement(App);
	const appWithStoreElement = React.createElement(Provider, {
		appStore: store.appStore,
		rulesStore: store.rulesStore,
		logsStore: store.logsStore,
		interceptsStore: store.interceptsStore,
	}, appElement);

	ReactDOM.render(appWithStoreElement, document.getElementById('app-root'));
})();
