import type {ExtensionTabManager} from '@/services/extension';
import type {RulesMapper} from '@/services/rulesMapper';
import type {SettingsMapper} from '@/services/settingsMapper';
import {AppUiStore} from './AppUiStore';
import {BreakpointsStore} from './BreakpointsStore';
import {DebuggerStateStore} from './DebuggerStateStore';
import {ErrorLogsStore} from './ErrorLogsStore';
import {NetworkLogsStore} from './NetworkLogsStore';
import {RulesStore} from './RulesStore';
import {SettingsStore} from './SettingsStore';
import {TabStore} from './TabStore';

export class RootStore {
	appUiStore: AppUiStore;
	settingsStore: SettingsStore;
	tabStore: TabStore;
	debuggerStateStore: DebuggerStateStore;
	breakpointsStore: BreakpointsStore;
	rulesStore: RulesStore;
	networkLogsStore: NetworkLogsStore;
	errorLogsStore: ErrorLogsStore;

	constructor({
		settingsMapper,
		rulesMapper,
		tabManager,
	}: {
		settingsMapper: SettingsMapper;
		rulesMapper: RulesMapper;
		tabManager: ExtensionTabManager;
	}) {
		this.appUiStore = new AppUiStore();
		this.settingsStore = new SettingsStore(settingsMapper);
		this.tabStore = new TabStore(tabManager);
		this.debuggerStateStore = new DebuggerStateStore();
		this.rulesStore = new RulesStore(this, rulesMapper);
		this.breakpointsStore = new BreakpointsStore();
		this.networkLogsStore = new NetworkLogsStore();
		this.errorLogsStore = new ErrorLogsStore();
	}
}
