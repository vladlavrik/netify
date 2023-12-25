import {action, computed, makeObservable, observable} from 'mobx';
import {ErrorLogEntry} from '@/interfaces/errorLog';

export class ErrorLogsStore {
	list: ErrorLogEntry[] = [];

	get hasLogs() {
		return this.list.length !== 0;
	}

	constructor() {
		makeObservable(this, {
			list: observable,
			hasLogs: computed,
			addLogEntry: action('addLogEntry'),
			cleanList: action('cleanList'),
		});
	}

	addLogEntry(data: ErrorLogEntry & {error?: any}) {
		const {error, ...logEntry} = data;
		if (!logEntry.details && error && typeof error === 'object') {
			logEntry.details = [error.name, error.toString()].filter(Boolean).join('\n');
		}
		this.list.push(logEntry);
	}

	cleanList() {
		this.list = [];
	}
}
