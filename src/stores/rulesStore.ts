import {createStore, createEffect} from 'effector';
import {Rule} from '@/interfaces/rule';
import {RulesMapper} from '@/services/indexedDB';

export const $rules = createStore<Rule[]>([]);
export const $hasRules = $rules.map(rules => rules.length > 0);
export const $rulesCount = $rules.map(rules => rules.length);

export const fetchRules = createEffect('fetch rules from db', {
	async handler({dbRulesMapper}: {dbRulesMapper: RulesMapper}) {
		return dbRulesMapper.getList();
	},
});

export const createRule = createEffect('save new rule into a db', {
	async handler({dbRulesMapper, rule}: {dbRulesMapper: RulesMapper; rule: Rule}) {
		return dbRulesMapper.saveNewItem(rule);
	},
});

export const updateRule = createEffect('update an existing rule into a db', {
	async handler({dbRulesMapper, rule}: {dbRulesMapper: RulesMapper; rule: Rule}) {
		return dbRulesMapper.updateItem(rule);
	},
});
export const moveRule = createEffect('update a rule position in the list rules in a db', {
	async handler({dbRulesMapper, ruleId, offset}: {dbRulesMapper: RulesMapper; ruleId: string; offset: number}) {
		// TODO
	},
});

export const removeRule = createEffect('remove a rule from db', {
	async handler({dbRulesMapper, ruleId}: {dbRulesMapper: RulesMapper; ruleId: string}) {
		return dbRulesMapper.removeItem(ruleId);
	},
});

export const removeAllRules = createEffect('remove all rules from db', {
	async handler({dbRulesMapper}: {dbRulesMapper: RulesMapper}) {
		return dbRulesMapper.removeAll();
	},
});

$rules.on(fetchRules.done, (_, {result}) => result);
$rules.on(createRule.done, (list, {params}) => [...list, params.rule]);
$rules.on(updateRule.done, (list, {params: {rule}}) => list.map(item => (item.id === rule.id ? rule : item)));
$rules.on(removeRule.done, (list, {params}) => list.filter(item => item.id !== params.ruleId));
$rules.reset(removeAllRules.done);
