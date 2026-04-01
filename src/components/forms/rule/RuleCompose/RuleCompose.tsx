import React, {memo, useMemo} from 'react';
import {toJS} from 'mobx';
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

	const ruleValue = useMemo<Rule>(() => {
		const cloneFrom = initialData?.cloneFrom;
		if (cloneFrom) {
			const plain = toJS(cloneFrom);
			const label = plain.label !== undefined && plain.label !== '' ? `Copy of ${plain.label}` : 'Copied Rule';
			return {
				...plain,
				id: randomHex(16),
				active: true,
				label,
			};
		}

		return {
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
		};
	}, [initialData]);

	return <RuleForm mode='create' initialRule={ruleValue} onSave={handleCreate} onCancel={handleClose} />;
});

RuleCompose.displayName = 'RuleCompose';
