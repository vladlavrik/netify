import type {RulesMapper} from '@/services/rulesMapper';
import {AppUiStore} from './AppUiStore';
import {BreakpointsStore} from './BreakpointsStore';
import {DebuggerStateStore} from './DebuggerStateStore';
import {LogsStore} from './LogsStore';
import {RulesStore} from './RulesStore';

export class RootStore {
	appUiStore: AppUiStore;
	debuggerStateStore: DebuggerStateStore;
	breakpointsStore: BreakpointsStore;
	rulesStore: RulesStore;
	logsStore: LogsStore;

	constructor({rulesMapper}: {rulesMapper: RulesMapper}) {
		this.appUiStore = new AppUiStore();
		this.debuggerStateStore = new DebuggerStateStore();
		this.rulesStore = new RulesStore(rulesMapper);
		this.breakpointsStore = new BreakpointsStore(this);
		this.logsStore = new LogsStore();
	}
}
