export const dbName = 'Netify';
export const dbVersion = 1;

let openedDB: IDBDatabase;

export function getOpenedIDB() {
	return openedDB;
}

export function openIDB() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(dbName, dbVersion);

		request.onerror = () => {
			reject(request.error);
		};

		request.onsuccess = () => {
			openedDB = request.result;
			resolve();
		};

		request.onupgradeneeded = event => {
			const db = request.result;

			if (event.oldVersion === 0) {
				const rulesStore = db.createObjectStore('rules', {keyPath: 'rule.id'});
				rulesStore.createIndex('tabId', 'tabId', {unique: false});
			}
		};
	});
}
