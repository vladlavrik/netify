import {promisifyIDBRequest, generitiryIDBRequest} from './helper';
import {Rule} from '@/interfaces/Rule';

interface RuleItem {
	tabId: number;
	timestamp: number;
	rule: Rule;
}

export class RulesMapper {
	constructor(private db: IDBDatabase, private tabId: number) {}

	async saveItem(rule: Rule) {
		await promisifyIDBRequest(
			this.db
				.transaction(['rules'], 'readwrite')
				.objectStore('rules')
				.add({
					tabId: this.tabId,
					timestamp: Date.now(),
					rule,
				}),
		);
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

		const cursorRequest = store.index('tabId').openKeyCursor(IDBKeyRange.only(this.tabId));
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
				.index('tabId')
				.getAll(this.tabId),
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
