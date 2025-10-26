import {RuntimeMode} from '@/interfaces/runtimeMode';
import {FetchDevtools, FetchRuleStore} from '@/services/devtools/fetch';
import {RequestListener} from '@/services/devtools/RequestListener';
import {ExtensionDevtoolsConnector, ExtensionIcon, ExtensionTabManager} from '@/services/extension';
import {openIDB} from '@/services/indexedDB';
import {RulesDatabaseMapper, RulesLocalMapper} from '@/services/rulesMapper';
import {Sandbox} from '@/services/sandbox';
import {SettingsMapper} from '@/services/settingsMapper';
import {RootStore} from '@/stores/RootStore';
import {ApplicationManager} from './PanelApplicationManager';
import '@/style/page.css';

(async () => {
	// Determine the runtime mode - devtools panel or popup and target tab
	const pageSearchParams = new URL(location.href).searchParams;
	const runtimeMode = pageSearchParams.get('mode') as RuntimeMode;
	const tabId = Number(pageSearchParams.get('tabId'));

	// Initialize services
	const sandboxIframe = document.getElementById('netify-sandbox-iframe') as HTMLIFrameElement;
	const sandbox = new Sandbox(sandboxIframe);
	const tabManager = new ExtensionTabManager(tabId);
	const extensionIcon = new ExtensionIcon(tabId, runtimeMode);
	const devtoolsConnector = new ExtensionDevtoolsConnector();
	const fetchRulesStore = new FetchRuleStore();
	const fetchDevtools = new FetchDevtools(devtoolsConnector, fetchRulesStore, sandbox);
	const requestListener = new RequestListener(devtoolsConnector);

	// Prepare database and initialize data mappers
	let db: IDBDatabase | undefined;
	let dbError: unknown;
	try {
		db = await openIDB();
	} catch (error) {
		console.info('IndexedDB open error, switch to a local data storing mode');
		console.error(error);
		dbError = error;
	}

	const rulesMapper = db ? new RulesDatabaseMapper(db) : new RulesLocalMapper();
	const settingsMapper = new SettingsMapper();

	// Initialize the stores
	const rootStore = new RootStore({settingsMapper, rulesMapper, tabManager});
	if (process.env.NODE_ENV === 'development') {
		(window as any).__store = rootStore;
	}

	// Report database initialization error
	if (!db) {
		rootStore.errorLogsStore.addLogEntry({
			title: 'Persistent database (IndexedDB) is not available, rules list will be cleared after session ends',
			error: dbError,
		});
	}

	// Create the application manager
	const panelApplicationManager = new ApplicationManager(
		runtimeMode,
		tabId,
		tabManager,
		extensionIcon,
		devtoolsConnector,
		fetchRulesStore,
		fetchDevtools,
		requestListener,
		rootStore,
	);

	try {
		await panelApplicationManager.initialize();
	} catch (error) {
		document.body.innerHTML = `
			<h1 style="color: #de0101; font-size: 22px; margin: 16px 12px;">Crash on initialization.</h1>
			<p style="color: #df0e0e; font-size: 12px; margin: 16px 12px; white-space: pre;">
				${error}
				<br>
				${(error as Error).stack}
			</p>
			<a style="color: #4672d1; margin: 0 12px;" href="https://github.com/vladlavrik/netify/issues" target=_blank">Follow the link to report.</a>
		`;
		throw error;
	}
})();
