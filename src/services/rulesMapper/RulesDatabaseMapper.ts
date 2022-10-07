import {Rule} from '@/interfaces/rule';
import {generetifyIDBRequest, promisifyIDBRequest} from '@/services/indexedDB';
import {RulesMapper} from './RulesMapper';

interface RuleItem {
	origin: string;
	timestamp: number;
	rule: Rule;
}

/**
 * Network debugging rules data mapper with data storing in the indexed db
 */
export class RulesDatabaseMapper implements RulesMapper {
	constructor(private db: IDBDatabase) {}

	async getList(perOrigin?: string) {
		const store = this.db.transaction(['rules'], 'readonly').objectStore('rules');

		const items = await promisifyIDBRequest<RuleItem[]>(
			perOrigin
				? store.index('origin').getAll(perOrigin) // Fetch only rules created in the required page url origin
				: store.getAll(), // Fetch all rules
		);

		return items
			.sort((a: RuleItem, b: RuleItem) => {
				if (a.timestamp === b.timestamp) {
					return 0;
				}

				return a.timestamp > b.timestamp ? -1 : 1;
			})
			.map((item) => item.rule);
	}

	async saveNewItem(rule: Rule, origin: string) {
		await promisifyIDBRequest(
			this.db.transaction(['rules'], 'readwrite').objectStore('rules').add({
				timestamp: Date.now(),
				origin,
				rule,
			}),
		);
	}

	async saveNewMultipleItems(rules: Rule[], origin: string) {
		const store = this.db.transaction(['rules'], 'readwrite').objectStore('rules');

		return Promise.allSettled<void>(
			rules.map((rule) =>
				promisifyIDBRequest(
					store.add({
						timestamp: Date.now(),
						origin,
						rule,
					}),
				).then(),
			),
		);
	}

	async updateItem(rule: Rule) {
		const store = this.db.transaction(['rules'], 'readwrite').objectStore('rules');
		const item = await promisifyIDBRequest(store.get(rule.id));
		item.rule = rule;
		await promisifyIDBRequest(store.put(item));
	}

	async removeItem(ruleId: string) {
		await promisifyIDBRequest(this.db.transaction(['rules'], 'readwrite').objectStore('rules').delete(ruleId));
	}

	async removeAll(perOrigin?: string) {
		const store = this.db.transaction(['rules'], 'readwrite').objectStore('rules');

		const cursorRequest = perOrigin
			? store.index('origin').openKeyCursor(IDBKeyRange.only(perOrigin))
			: store.openKeyCursor();

		const cursorGenerator = generetifyIDBRequest(cursorRequest);

		const deleteRequestsPromises: Promise<void>[] = [];
		for await (const item of cursorGenerator) {
			const deleteRequest = store.delete(item!.primaryKey);
			deleteRequestsPromises.push(promisifyIDBRequest(deleteRequest));
		}

		await Promise.all(deleteRequestsPromises);
	}
}
