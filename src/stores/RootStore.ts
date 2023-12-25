import type {RulesMapper} from '@/services/rulesMapper';
import {AppUiStore} from './AppUiStore';
import {BreakpointsStore} from './BreakpointsStore';
import {DebuggerStateStore} from './DebuggerStateStore';
import {ErrorLogsStore} from './ErrorLogsStore';
import {NetworkLogsStore} from './NetworkLogsStore';
import {RulesStore} from './RulesStore';

export class RootStore {
	appUiStore: AppUiStore;
	debuggerStateStore: DebuggerStateStore;
	breakpointsStore: BreakpointsStore;
	rulesStore: RulesStore;
	networkLogsStore: NetworkLogsStore;
	errorLogsStore: ErrorLogsStore;

	constructor({rulesMapper}: {rulesMapper: RulesMapper}) {
		this.appUiStore = new AppUiStore();
		this.debuggerStateStore = new DebuggerStateStore();
		this.rulesStore = new RulesStore(this, rulesMapper);
		this.breakpointsStore = new BreakpointsStore();
		this.networkLogsStore = new NetworkLogsStore();
		this.errorLogsStore = new ErrorLogsStore();
	}
}
