import React, {memo} from 'react';
import {useField} from 'formik';
import {FieldError} from '@/components/@common/forms/FieldError';
import {TextField} from '@/components/@common/forms/TextField';
import styles from './ruleDelayField.css';

interface RuleDelayFieldProps {
	name: string;
}

export const RuleDelayField = memo<RuleDelayFieldProps>(({name}) => {
	const [field] = useField(name);

	return (
		<div>
			<TextField className={styles.field} type='number' min={0} max={60000} maxLength={5} {...field} />
			<FieldError name={name} />
		</div>
	);
});

RuleDelayField.displayName = 'RuleDelayField';
