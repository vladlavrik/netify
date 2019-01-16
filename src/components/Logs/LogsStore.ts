import {observable, action} from 'mobx';
import {RootStore} from '@/components/App/RootStore';
import {Log} from '@/debugger/interfaces/Log';

export class LogsStore {
	constructor(_rootStore: RootStore) {}

	@observable
	readonly list: Log[] = [];

	@action
	add(item: Log) {
		this.list.push(item);
	}

	@action
	clearAll() {
		this.list.splice(0, this.list.length);
	}
}
