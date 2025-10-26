import {action, computed, observable} from 'mobx';
import {NetworkLogEntry} from '@/interfaces/networkLog';

export class NetworkLogsStore {
	@observable
	accessor list: NetworkLogEntry[] = [];

	@computed
	get hasLogs() {
		return this.list.length !== 0;
	}

	@action('addLogEntry')
	addLogEntry(logEntry: NetworkLogEntry) {
		if (logEntry.interceptStage === 'Response') {
			const existingEntry = this.list.find(
				(item) => item.requestId === logEntry.requestId && item.interceptStage === 'Request',
			);

			if (existingEntry) {
				existingEntry.interceptStage = 'Both';
				return;
			}
		}

		this.list.push(logEntry);
	}

	@action('cleanList')
	cleanList() {
		this.list = [];
	}
}
