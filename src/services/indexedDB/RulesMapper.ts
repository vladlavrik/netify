import {promisifyIDBRequest, generetifyIDBRequest} from './helper';
import {Rule} from '@/interfaces/rule';

interface RuleItem {
	origin: string;
	timestamp: number;
	rule: Rule;
}

export class RulesMapper {
	constructor(private db: IDBDatabase, private origin: string) {}

	defineOrigin(origin: string) {
		this.origin = origin;
	}

	async saveNewItem(rule: Rule) {
		await promisifyIDBRequest(
			this.db
				.transaction(['rules'], 'readwrite')
				.objectStore('rules')
				.add({
					origin: this.origin,
					timestamp: Date.now(),
					rule,
				}),
		);
	}

	async updateItem(rule: Rule) {
		const store = this.db.transaction(['rules'], 'readwrite').objectStore('rules');
		const item = await promisifyIDBRequest(store.get(rule.id));
		item.rule = rule;
		await promisifyIDBRequest(store.put(item));
	}

	async removeItem(ruleId: string) {
		await promisifyIDBRequest(
			this.db
				.transaction(['rules'], 'readwrite')
				.objectStore('rules')
				.delete(ruleId),
		);
	}

	async removeAll(perCurrentOrigin: boolean) {
		const store = this.db.transaction(['rules'], 'readwrite').objectStore('rules');

		const cursorRequest = perCurrentOrigin
			? store.index('origin').openKeyCursor(IDBKeyRange.only(this.origin))
			: store.openKeyCursor();

		const cursorGenerator = generetifyIDBRequest(cursorRequest);

		const deleteRequestsPromises: Promise<IDBRequest>[] = [];
		for await (const item of cursorGenerator) {
			const deleteRequest = store.delete((item as IDBCursor).primaryKey);
			deleteRequestsPromises.push(promisifyIDBRequest(deleteRequest));
		}

		await Promise.all(deleteRequestsPromises);
	}

	async getList(perCurrentOrigin: boolean) {
		const store = this.db.transaction(['rules'], 'readonly').objectStore('rules');

		const items = await promisifyIDBRequest<RuleItem[]>(
			perCurrentOrigin
				? store.index('origin').getAll(this.origin) // Fetch only rules created in the current browser page url origin
				: store.getAll(), // Fetch all rules
		);

		return items
			.sort((a: RuleItem, b: RuleItem) => {
				if (a.timestamp === b.timestamp) {
					return 0;
				}

				return a.timestamp > b.timestamp ? 1 : -1;
			})
			.map(item => item.rule);
	}
}
