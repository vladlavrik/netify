import React, {memo, useMemo} from 'react';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {Rule} from '@/interfaces/rule';
import {randomHex} from '@/helpers/random';
import {useStores} from '@/stores/useStores';
import {RuleForm} from '../RuleForm';

export const RuleCompose = memo(() => {
	const {rulesStore} = useStores();

	const handleCreate = (rule: Rule) => {
		rulesStore.createRule(rule);
	};

	const handleClose = () => {
		rulesStore.closeCompose();
	};

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

	return <RuleForm mode='create' initialRule={ruleValue} onSave={handleCreate} onCancel={handleClose} />;
});

RuleCompose.displayName = 'RuleCompose';
