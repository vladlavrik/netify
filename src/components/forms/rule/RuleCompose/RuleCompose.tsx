import React, {memo, useMemo} from 'react';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {Rule, RuleInitialData} from '@/interfaces/rule';
import {randomHex} from '@/helpers/random';
import {useStores} from '@/stores/useStores';
import {RuleForm} from '../RuleForm';

interface RuleComposeProps {
	initialData?: RuleInitialData;
}

export const RuleCompose = memo<RuleComposeProps>((props) => {
	const {initialData} = props;

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
			filter: Object.assign(
				{
					url: '',
					resourceTypes: [],
					methods: [],
				},
				initialData?.filter,
			),
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
