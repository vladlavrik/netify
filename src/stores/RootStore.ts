import type {RulesMapper} from '@/services/rulesMapper';
import {AppUiStore} from './AppUiStore';
import {AttentionsStore} from './AttentionsStore';
import {BreakpointsStore} from './BreakpointsStore';
import {DebuggerStateStore} from './DebuggerStateStore';
import {LogsStore} from './LogsStore';
import {RulesStore} from './RulesStore';

export class RootStore {
	appUiStore: AppUiStore;
	attentionsStore: AttentionsStore;
	debuggerStateStore: DebuggerStateStore;
	breakpointsStore: BreakpointsStore;
	rulesStore: RulesStore;
	logsStore: LogsStore;

	constructor({rulesMapper}: {rulesMapper: RulesMapper}) {
		this.appUiStore = new AppUiStore();
		this.attentionsStore = new AttentionsStore();
		this.debuggerStateStore = new DebuggerStateStore();
		this.rulesStore = new RulesStore(this, rulesMapper);
		this.breakpointsStore = new BreakpointsStore();
		this.logsStore = new LogsStore();
	}
}
