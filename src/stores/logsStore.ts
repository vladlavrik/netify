import {createStore, createEvent} from 'effector';
import produce from 'immer';
import {Log} from '@/interfaces/log';

export const $logs = createStore<Log[]>([]);
export const $hasLogs = $logs.map(logs => logs.length > 0);

export const addLogEntry = createEvent<Log>('create a log entry');
export const clearLogsList = createEvent('clear logs list');

$logs
	.on(addLogEntry, (logs, entry) =>
		produce(logs, draft => {
			if (entry.interceptStage === 'Response') {
				const existingEntry = draft.find(
					item => item.requestId === entry.requestId && item.interceptStage === 'Request',
				);

				if (existingEntry) {
					existingEntry.interceptStage = 'Both';
					return;
				}
			}
			draft.push(entry);
		}),
	)
	.reset(clearLogsList);
