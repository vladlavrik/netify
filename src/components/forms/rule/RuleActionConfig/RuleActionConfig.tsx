import React, {memo} from 'react';
import {useField} from 'formik';
import {ActionsType} from '@/constants/ActionsType';
import {RuleActionBreakpoint} from '../RuleActionBreakpoint';
import {RuleActionMutation} from '../RuleActionMutation';
import {RuleActionLocalResponse} from '../RuleActionLocalResponse';
import {RuleActionFailure} from '../RuleActionFailure';

export const RuleActionConfig = memo(() => {
	const [field] = useField<ActionsType>('actionType');

	switch (field.value) {
		case ActionsType.Breakpoint:
			return <RuleActionBreakpoint />;

		case ActionsType.Mutation:
			return <RuleActionMutation />;

		case ActionsType.LocalResponse:
			return <RuleActionLocalResponse />;

		case ActionsType.Failure:
			return <RuleActionFailure />;
	}
});

RuleActionConfig.displayName = 'RuleActionConfig';
