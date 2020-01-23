import {migrations} from './migrations';

export const dbName = 'Netify';
export const dbVersion = 2;

export async function openIDB() {
	return new Promise<IDBDatabase>((resolve, reject) => {
		const request = indexedDB.open(dbName, dbVersion);

		request.onerror = () => {
			reject(request.error);
		};

		request.onsuccess = () => {
			resolve(request.result);
			console.log('Success open');
		};

		request.onupgradeneeded = function({oldVersion}) {
			for (let oldVersionStep = oldVersion; oldVersionStep < dbVersion; oldVersionStep++) {
				migrations[oldVersionStep](this.result, this.transaction!);
			}
		};
	});
}
