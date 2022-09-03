import {action, computed, makeObservable, observable} from 'mobx';
import {LogEntry} from '@/interfaces/log';

export class LogsStore {
	list: LogEntry[] = [];

	/** Log not only mutated request; TODO for future */
	logAllRequest = false;

	get hasLogs() {
		return this.list.length !== 0;
	}

	constructor() {
		makeObservable(this, {
			list: observable,
			logAllRequest: observable,
			hasLogs: computed,
			addLogEntry: action('addLogEntry'),
			cleanList: action('cleanList'),
			toggleLogAllRequest: action('toggleLogAllRequest'),
		});
	}

	addLogEntry(logEntry: LogEntry) {
		this.list.push(logEntry);
	}

	cleanList() {
		this.list = [];
	}

	toggleLogAllRequest() {
		this.logAllRequest = !this.logAllRequest;
	}
}
