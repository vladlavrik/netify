import {Rule} from '@/interfaces/rule';

/**
 * Abstract data mapper for network debugging rules
 */
export interface RulesMapper {
	getList(perOrigin?: string): Promise<Rule[]>;

	saveNewItem(rule: Rule, origin: string): Promise<void>;

	saveNewMultipleItems(rules: Rule[], origin: string): Promise<PromiseSettledResult<void>[]>;

	updateItem(rule: Rule): Promise<void>;

	removeItems(ruleIds: string[]): Promise<void>;

	removeAll(perOrigin?: string): Promise<void>;
}
