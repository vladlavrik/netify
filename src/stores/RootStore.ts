import {AppStore} from './AppStore';
import {RulesStore} from './RulesStore';
import {LogsStore} from './LogsStore';

export class RootStore {
	appStore = new AppStore(this);
	rulesStore = new RulesStore(this);
	logsStore = new LogsStore(this);
}
