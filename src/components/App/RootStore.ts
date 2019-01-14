import {AppStore} from './AppStore';
import {LogsStore} from '@/components/Logs';
import {RulesStore} from '@/components/Rules';

export class RootStore {
	appStore = new AppStore(this);
	rulesStore = new RulesStore(this);
	logsStore = new LogsStore(this);
}
