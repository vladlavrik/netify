import {createStore, createEvent} from 'effector';
import {Log} from '@/interfaces/log';

export const $logs = createStore<Log[]>([]);
export const $hasLogs = $logs.map(logs => logs.length > 0);

export const addLogEntry = createEvent<Log>('create log entry');
export const clearLogsList = createEvent('clear logs list');

$logs
	.on(addLogEntry, (logs, entry) => {
		if (entry.requestStage === 'Response') {
			const existingEntry = logs.find(
				item => item.requestId === entry.requestId && item.requestStage === 'Request',
			);

			if (existingEntry) {
				// TODO check is a previous state should not be immutable, if its required - use "immer"
				existingEntry.requestStage = 'Both';
				return [...logs];
			}
		}

		return [...logs, entry];
	})
	.reset(clearLogsList);
