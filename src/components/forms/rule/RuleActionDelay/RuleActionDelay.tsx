import React, {memo} from 'react';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {FieldRow} from '@/components/forms/common/FieldRow';
import styles from './ruleActionDelay.css';
import { TextField } from '@/components/@common/forms/TextField';
import {FieldError} from '@/components/@common/forms/FieldError';

export const RuleActionDelay = memo(function RuleActionDelay() {
	const name = `actionConfigs.${RuleActionsType.Delay}.timeout`;
	return (
		<FieldRow title='Delay time:'>
			<div>
				<TextField className={styles.field} name={name} suffixChildren={'ms'} />
				<FieldError name={name} />
			</div>
		</FieldRow>
	);
});
