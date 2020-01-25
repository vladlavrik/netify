import React, {memo} from 'react';
import {TextField} from '@/components/@common/forms/TextField';
import {FieldRow} from '@/components/forms/common/FieldRow';
import styles from './ruleLabel.css';

export const RuleLabel = memo(function RuleLabel() {
	return (
		<FieldRow className={styles.root} title='Label:'>
			<TextField
				className={styles.field}
				name='label'
				placeholder='The rule label (optional)'
				maxLength={256}
				autoFocus
			/>
		</FieldRow>
	);
});
