import React, {memo, useMemo} from 'react';
import {Rule} from '@/interfaces/Rule';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {randomHex} from '@/helpers/random';
import {RuleForm} from '../RuleForm';

interface RuleComposeProps {
	onSave(rule: Rule): void;
	onCancel(): void;
}

export const RuleCompose = memo<RuleComposeProps>(props => {
	const {onSave, onCancel} = props;

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

	return <RuleForm initialRule={ruleValue} onSave={onSave} onCancel={onCancel} />;
});

RuleCompose.displayName = 'RuleCompose';
