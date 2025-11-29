import {action, computed, observable} from 'mobx';
import {NetworkLogEntry} from '@/interfaces/networkLog';
import {RootStore} from '@/stores/RootStore';

export class NetworkLogsStore {
	@observable
	accessor list: NetworkLogEntry[] = [];

	@computed
	get hasLogs() {
		return this.list.length !== 0;
	}

	@computed
	get filteredList() {
		if (this.rootStore.settingsStore.values.networkLogOnlyAffected) {
			return this.list.filter((item) => item.modification);
		}
		return this.list;
	}

	constructor(private rootStore: RootStore) {}

	@action('addLogEntry')
	addLogEntry(logEntry: NetworkLogEntry) {
		const existingEntry = this.list.find((item) => item.requestId === logEntry.requestId);

		if (!existingEntry) {
			this.list.push(logEntry);
			return;
		}

		if (logEntry.modification) {
			if (!existingEntry?.modification) {
				existingEntry.modification = logEntry.modification;
			} else if (existingEntry.modification.stage === 'Request' && logEntry.modification.stage === 'Response') {
				existingEntry.modification.stage = 'Both';
			}
		}
	}

	@action('markRequestFinished')
	markRequestFinished(
		data:
			| {success: true; requestId: string; responseStatusCode: number}
			| {success: false; requestId: string; errorText: string},
	) {
		const entry = this.list.find((item) => item.requestId === data.requestId);
		if (entry) {
			if (data.success) {
				entry.responseStatusCode = data.responseStatusCode;
			} else {
				entry.responseError = data.errorText;
			}
		}
	}

	@action('cleanList')
	cleanList() {
		this.list = [];
	}
}
