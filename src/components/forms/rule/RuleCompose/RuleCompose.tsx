import React, {memo, useCallback, useContext, useMemo} from 'react';
import {Rule} from '@/interfaces/rule';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {DbContext} from '@/contexts/dbContext';
import {createRule} from '@/stores/rulesStore';
import {hideCompose} from '@/stores/uiStore';
import {randomHex} from '@/helpers/random';
import {RuleForm} from '../RuleForm';

export const RuleCompose = memo(function RuleCompose() {
	const {rulesMapper} = useContext(DbContext)!;

	const handleSave = useCallback(async (rule: Rule) => {
		await createRule({rulesMapper, rule});
		hideCompose();
	}, []);

	const handleCancel = useCallback(async () => {
		hideCompose();
	}, []);

	const ruleValue = useMemo<Rule>(
		() => ({
			id: randomHex(16),
			active: true,
			filter: {
				url: '',
				resourceTypes: [],
				methods: [],
			},
			action: {
				type: RuleActionsType.Mutation,
				request: {
					setHeaders: [],
					dropHeaders: [],
				},
				response: {
					setHeaders: [],
					dropHeaders: [],
				},
			},
		}),
		[],
	);

	return <RuleForm initialRule={ruleValue} onSave={handleSave} onCancel={handleCancel} />;
});
