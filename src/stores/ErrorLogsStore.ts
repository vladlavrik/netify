import {action, computed, observable} from 'mobx';
import {ErrorLogEntry} from '@/interfaces/errorLog';

export class ErrorLogsStore {
	@observable
	accessor list: ErrorLogEntry[] = [];

	@computed
	get hasLogs() {
		return this.list.length !== 0;
	}

	@action('addLogEntry')
	addLogEntry(data: ErrorLogEntry & {error?: any}) {
		const {error, ...logEntry} = data;
		if (!logEntry.details && error && typeof error === 'object') {
			logEntry.details = [error.name, error.toString()].filter(Boolean).join('\n');
		}
		this.list.push(logEntry);
	}

	@action('cleanList')
	cleanList() {
		this.list = [];
	}
}
