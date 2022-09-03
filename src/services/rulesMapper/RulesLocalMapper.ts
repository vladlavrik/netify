import {Rule} from '@/interfaces/rule';
import {RulesMapper} from './RulesMapper';

interface RuleItem {
	origin: string;
	rule: Rule;
}

/**
 * Network debugging rules data mapper with data storing in a local state
 */
export class RulesLocalMapper implements RulesMapper {
	private list: RuleItem[] = [];

	async saveNewItem(rule: Rule, origin: string) {
		this.list.push({rule, origin});
	}

	async saveNewMultipleItems(rules: Rule[], origin: string) {
		for (const rule of rules) {
			this.list.push({rule, origin});
		}

		return this.list.map<PromiseSettledResult<void>>(() => ({status: 'fulfilled', value: undefined}));
	}

	async updateItem(rule: Rule) {
		const ruleItem = this.list.find((item) => item.rule.id === rule.id);
		if (ruleItem) {
			ruleItem.rule = rule;
		}
	}

	async removeItem(ruleId: string) {
		const itemIndex = this.list.findIndex((item) => item.rule.id === ruleId);
		if (itemIndex) {
			this.list.splice(itemIndex, 1);
		}
	}

	async removeAll(perOrigin?: string) {
		if (perOrigin) {
			this.list = this.list.filter((item) => item.origin !== origin);
		} else {
			this.list = [];
		}
	}

	async getList(perOrigin?: string) {
		const list = perOrigin ? this.list.filter((item) => item.origin !== origin) : this.list;
		return list.map((item) => item.rule);
	}
}
