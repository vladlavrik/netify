import {RulesMapper} from '@/services/rulesMapper';
import {AppUiStore} from '@/stores/AppUiStore';
import {DebuggerStateStore} from '@/stores/DebuggerStateStore';
import {LogsStore} from '@/stores/LogsStore';
import {RulesStore} from '@/stores/RulesStore';

export class RootStore {
	appUiStore: AppUiStore;
	debuggerStateStore: DebuggerStateStore;
	logsStore: LogsStore;
	rulesStore: RulesStore;

	constructor({rulesMapper}: {rulesMapper: RulesMapper}) {
		this.appUiStore = new AppUiStore();
		this.debuggerStateStore = new DebuggerStateStore();
		this.logsStore = new LogsStore();
		this.rulesStore = new RulesStore(rulesMapper);
	}
}
