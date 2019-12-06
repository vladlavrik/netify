import {promisifyIDBRequest, generitiryIDBRequest} from './helper';
import {Rule} from '@/interfaces/rule';

interface RuleItem {
	hostname: string;
	timestamp: number;
	rule: Rule;
}

export class RulesMapper {
	constructor(private db: IDBDatabase, private hostname: string) {}

	async saveNewItem(rule: Rule) {
		await promisifyIDBRequest(
			this.db
				.transaction(['rules'], 'readwrite')
				.objectStore('rules')
				.add({
					hostname: this.hostname,
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

	async removeAll() {
		const store = this.db.transaction(['rules'], 'readwrite').objectStore('rules');

		const cursorRequest = store.index('hostname').openKeyCursor(IDBKeyRange.only(this.hostname));
		const cursorGenerator = generitiryIDBRequest(cursorRequest);

		const deleteRequestsPromises: Promise<IDBRequest>[] = [];
		for await (const item of cursorGenerator) {
			const deleteRequest = store.delete((item as IDBCursor).primaryKey);
			deleteRequestsPromises.push(promisifyIDBRequest(deleteRequest));
		}

		await Promise.all(deleteRequestsPromises);
	}

	async getList(): Promise<Rule[]> {
		const items = await promisifyIDBRequest<RuleItem[]>(
			this.db
				.transaction(['rules'], 'readonly')
				.objectStore('rules')
				.index('hostname')
				.getAll(this.hostname),
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
