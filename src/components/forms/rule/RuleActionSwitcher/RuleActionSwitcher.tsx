import React, {memo} from 'react';
import {useField} from 'formik';
import classNames from 'classnames';
import {ruleActionsTypeHumanTitles} from '@/constants/RuleActionsType';
import {RadioButton} from '@/components/@common/forms/RadioButton';
import {FieldRow} from '@/components/forms/common/FieldRow';
import styles from './ruleActionSwitcher.css';

export const RuleActionSwitcher = memo(() => {
	const name = 'actionType';
	const [field] = useField(name);

	return (
		<FieldRow className={styles.root} title='Action:'>
			{Object.entries(ruleActionsTypeHumanTitles).map(([value, title]) => (
				<div key={value} className={classNames(styles.entry, field.value === value && styles.current)}>
					<RadioButton name={name} value={value}>
						{title}
					</RadioButton>
				</div>
			))}
		</FieldRow>
	);
});

RuleActionSwitcher.displayName = 'RuleActionSwitcher';
