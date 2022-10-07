import React, {memo} from 'react';
import {useField} from 'formik';
import {TextField} from '@/components/@common/forms/TextField';
import {RuleRow} from '../RuleRow';
import styles from './ruleLabel.css';

export const RuleLabel = memo(() => {
	const [field] = useField('label');

	return (
		<RuleRow className={styles.root} title='Label:'>
			<TextField
				className={styles.field}
				placeholder='The rule label (optional)'
				maxLength={256}
				autoFocus
				{...field}
			/>
		</RuleRow>
	);
});

RuleLabel.displayName = 'RuleLabel';
