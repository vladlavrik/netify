import React, {memo} from 'react';
import {useField} from 'formik';
import {ResponseErrorReason, responseErrorReasonsHumanTitles, responseErrorReasonsList} from '@/constants/ResponseErrorReason'; // prettier-ignore
import {RuleActionsType} from '@/constants/RuleActionsType';
import {SelectField} from '@/components/@common/forms/SelectField';
import {RuleRow} from '../RuleRow';
import styles from './ruleActionFailure.css';

const optionTitleGetter = (value: ResponseErrorReason) => responseErrorReasonsHumanTitles[value];

export const RuleActionFailure = memo(() => {
	const [field] = useField(`actionConfigs.${RuleActionsType.Failure}.reason`);

	return (
		<RuleRow title='Reason:'>
			<SelectField
				className={styles.field}
				options={responseErrorReasonsList}
				optionTitleGetter={optionTitleGetter}
				{...field}
			/>
		</RuleRow>
	);
});

RuleActionFailure.displayName = 'RuleActionFailure';
