import React, {memo} from 'react';
import {useField} from 'formik';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {TextareaField} from '@/components/@common/forms/TextareaField';
import {RuleRow} from '../RuleRow';
import styles from './ruleActionScript.css';

export const RuleActionScript = memo(() => {
	const [requestField] = useField(`actionConfigs.${RuleActionsType.Script}.request`);
	const [responseField] = useField(`actionConfigs.${RuleActionsType.Script}.response`);

	return (
		<>
			<RuleRow title='Request:'>
				<TextareaField {...requestField} rows={10} />
			</RuleRow>
			<RuleRow title='Response:'>
				<TextareaField {...responseField} rows={10} />
			</RuleRow>
		</>
	);
});

RuleActionScript.displayName = 'RuleActionScript';
