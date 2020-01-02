import {UIStore} from './UIStore';
import {RulesStore} from './RulesStore';
import {LogsStore} from './LogsStore';

export class RootStore {
	uiStore = new UIStore(this);
	rulesStore = new RulesStore(this);
	logsStore = new LogsStore(this);
}
