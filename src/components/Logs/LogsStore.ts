import {observable, action} from 'mobx';

export class LogsStore {
	@observable
	readonly list: LogItem[] = [];

	@action
	add(item: LogItem) {
		this.list.push(item);
	}
}

interface LogItem {
	timestamp: number;
	ruleId: number;
}
