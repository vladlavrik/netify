import React, {memo} from 'react';
import {ResponseErrorReason,responseErrorReasonsHumanTitles, responseErrorReasonsList} from '@/constants/ResponseErrorReason'; // prettier-ignore
import {RuleActionsType} from '@/constants/RuleActionsType';
import {SelectField} from '@/components/@common/forms/SelectField';
import {FieldRow} from '@/components/forms/common/FieldRow';
import styles from './ruleActionFailure.css';

const optionTitleGetter = (value: ResponseErrorReason) => responseErrorReasonsHumanTitles[value];

export const RuleActionFailure = memo(() => (
	<FieldRow title='Reason:'>
		<SelectField
			className={styles.field}
			name={`actionConfigs.${RuleActionsType.Failure}.reason`}
			options={responseErrorReasonsList}
			optionTitleGetter={optionTitleGetter}
			required
		/>
	</FieldRow>
));

RuleActionFailure.displayName = 'RuleActionFailure';
