import React, {memo} from 'react';
import {useField} from 'formik';
import {TextField} from '@/components/@common/forms/TextField';
import {RuleRow} from '../RuleRow';
import styles from './ruleLabel.css';

export const RuleLabel = memo(() => {
	const [field] = useField('label');

	return (
		<RuleRow className={styles.root} title={chrome.i18n.getMessage('label')}>
			<TextField
				className={styles.field}
				placeholder={chrome.i18n.getMessage('labelPlaceholder')}
				maxLength={256}
				autoFocus
				{...field}
			/>
		</RuleRow>
	);
});

RuleLabel.displayName = 'RuleLabel';
