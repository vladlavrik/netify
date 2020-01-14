export async function v1Migration(db: IDBDatabase) {
	const rulesStore = db.createObjectStore('rules', {keyPath: 'rule.id'});
	rulesStore.createIndex('origin', 'origin', {unique: false});
}
