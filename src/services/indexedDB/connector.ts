import {migrations} from './migrations';

export const dbName = 'Netify';
export const dbVersion = 1;

export async function openIDB() {
	return new Promise<IDBDatabase>((resolve, reject) => {
		const request = indexedDB.open(dbName, dbVersion);

		request.onerror = () => {
			reject(request.error);
		};

		request.onsuccess = () => {
			resolve(request.result);
		};

		request.onupgradeneeded = async event => {
			const db = request.result;

			for (let itemVersion = event.oldVersion; itemVersion < dbVersion; itemVersion++) {
				await migrations[itemVersion](db);
			}
		};
	});
}
