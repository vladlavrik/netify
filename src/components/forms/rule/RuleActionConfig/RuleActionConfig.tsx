import React, {memo} from 'react';
import {useField} from 'formik';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {RuleActionBreakpoint} from '../RuleActionBreakpoint';
import {RuleActionFailure} from '../RuleActionFailure';
import {RuleActionLocalResponse} from '../RuleActionLocalResponse';
import {RuleActionMutation} from '../RuleActionMutation';

export const RuleActionConfig = memo(() => {
	const [field] = useField<RuleActionsType>('actionType');

	switch (field.value) {
		case RuleActionsType.Breakpoint:
			return <RuleActionBreakpoint />;

		case RuleActionsType.Mutation:
			return <RuleActionMutation />;

		case RuleActionsType.LocalResponse:
			return <RuleActionLocalResponse />;

		case RuleActionsType.Failure:
			return <RuleActionFailure />;
	}
});

RuleActionConfig.displayName = 'RuleActionConfig';
