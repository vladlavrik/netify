import {createStore, createEffect} from 'effector';
import {Rule} from '@/interfaces/rule';
import {RulesMapper} from '@/services/indexedDB';

export const $rules = createStore<Rule[]>([]);
export const $hasRules = $rules.map(rules => rules.length > 0);
export const $hasActiveRules = $rules.map(rules => rules.filter(rule => rule.active).length > 0);
export const $rulesCount = $rules.map(rules => rules.length);

export const fetchRules = createEffect('fetch rules from db', {
	async handler({rulesMapper, perCurrentHostname}: {rulesMapper: RulesMapper; perCurrentHostname: boolean}) {
		return rulesMapper.getList(perCurrentHostname);
	},
});

export const createRule = createEffect('save new rule into a db', {
	async handler({rulesMapper, rule}: {rulesMapper: RulesMapper; rule: Rule}) {
		return rulesMapper.saveNewItem(rule);
	},
});

export const updateRule = createEffect('update an existing rule into a db', {
	async handler({rulesMapper, rule}: {rulesMapper: RulesMapper; rule: Rule}) {
		return rulesMapper.updateItem(rule);
	},
});
export const moveRule = createEffect('update a rule position in the list rules in a db', {
	async handler({rulesMapper, ruleId, offset}: {rulesMapper: RulesMapper; ruleId: string; offset: number}) {
		// TODO
	},
});

export const removeRule = createEffect('remove a rule from db', {
	async handler({rulesMapper, ruleId}: {rulesMapper: RulesMapper; ruleId: string}) {
		return rulesMapper.removeItem(ruleId);
	},
});

export const removeAllRules = createEffect('remove all rules from db', {
	async handler({rulesMapper, perCurrentOrigin}: {rulesMapper: RulesMapper; perCurrentOrigin: boolean}) {
		return rulesMapper.removeAll(perCurrentOrigin);
	},
});

$rules.on(fetchRules.done, (_, {result}) => result);
$rules.on(createRule.done, (list, {params}) => [...list, params.rule]);
$rules.on(updateRule.done, (list, {params: {rule}}) => list.map(item => (item.id === rule.id ? rule : item)));
$rules.on(removeRule.done, (list, {params}) => list.filter(item => item.id !== params.ruleId));
$rules.reset(removeAllRules.done);
