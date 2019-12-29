import React, {memo} from 'react';
import {ActionsType} from '@/constants/ActionsType';
import {responseErrorReasonsList} from '@/constants/ResponseErrorReason';
import {SelectField} from '@/components/@common/forms/SelectField';
import {FieldRow} from '@/components/forms/common/FieldRow';
import styles from './ruleActionFailure.css';

export const RuleActionFailure = memo(() => (
	<FieldRow title='Reason:'>
		<SelectField
			className={styles.field}
			name={`actionConfigs.${ActionsType.Failure}.reason`}
			options={responseErrorReasonsList}
			required
		/>
	</FieldRow>
));

RuleActionFailure.displayName = 'RuleActionFailure';
