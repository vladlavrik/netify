import {observable, action, computed} from 'mobx';
import {Log} from '@/interfaces/log';
import {RootStore} from './RootStore';

export class LogsStore {
	constructor(private rootStore: RootStore) {}

	@observable
	readonly list: Log[] = [];

	@computed
	get listIsEmpty() {
		return this.list.length === 0;
	}

	@action
	add(item: Log) {
		this.list.push(item);
	}

	@action
	clearList() {
		this.list.splice(0, this.list.length);
	}
}
