import {AppStore} from './AppStore';
import {LogsStore} from './LogsStore';
import {RulesStore} from './RulesStore';

export class RootStore {
	appStore = new AppStore(this);
	rulesStore = new RulesStore(this);
	logsStore = new LogsStore(this);
}
