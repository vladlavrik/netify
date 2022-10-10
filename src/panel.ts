import {FetchDevtools, FetchRuleStore} from '@/services/devtools/fetch';
import {ExtensionDevtoolsConnector, ExtensionIcon, ExtensionTab} from '@/services/extension';
import {openIDB} from '@/services/indexedDB';
import {RulesDatabaseMapper, RulesLocalMapper} from '@/services/rulesMapper';
import {RootStore} from '@/stores/RootStore';
import {PanelApplicationManager} from './PanelApplicationManager';
import '@/style/page.css';

(async () => {
	const {tabId} = chrome.devtools.inspectedWindow;
	const tab = new ExtensionTab(tabId);
	const extensionIcon = new ExtensionIcon(tabId, 'Netify');
	const devtoolsConnector = new ExtensionDevtoolsConnector(tabId);
	const fetchRulesStore = new FetchRuleStore();
	const fetchDevtools = new FetchDevtools(devtoolsConnector, fetchRulesStore);

	// Require the current browser's tab hostname
	const {origin: tabOrigin} = await tab.getPageUrl();

	// Prepare database and initialize data mappers
	let db: IDBDatabase | undefined;
	try {
		db = await openIDB();
	} catch (error) {
		console.info('IndexedDB open error, switch to a local data storing mode');
		console.error(error);
		// TODO report to the UI
	}

	const rulesMapper = db ? new RulesDatabaseMapper(db) : new RulesLocalMapper();

	// Initialize the stores
	const rootStore = new RootStore({rulesMapper});
	if (process.env.NODE_ENV === 'development') {
		(window as any).__store = rootStore;
	}

	if (!db) {
		rootStore.attentionsStore.push(
			'Persistent database (IndexedDB) is not available, rules list will be cleared after session ends',
		);
	}

	// Create the panel application manager
	const panelApplicationManager = new PanelApplicationManager(
		tab,
		extensionIcon,
		devtoolsConnector,
		fetchRulesStore,
		fetchDevtools,
		rootStore,
		tabOrigin,
	);

	try {
		await panelApplicationManager.initialize();
	} catch (error) {
		document.body.innerHTML = `
			<h1 style="color: #de0101; font-size: 22px; margin: 16px 12px;">Crash on initialization.</h1>
			<p style="color: #df0e0e; font-size: 12px; margin: 16px 12px; white-space: pre;">${error}</p>
			<a style="color: #4672d1; margin: 0 12px;" href="https://github.com/vladlavrik/netify/issues" target=_blank">Follow link to report.</a>
		`;
		throw error;
	}
})();
