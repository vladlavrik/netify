import React, {memo} from 'react';
import {useField} from 'formik';
import cn from 'classnames';
import {RuleActionsType, ruleActionsTypeHumanTitles} from '@/constants/RuleActionsType';
import {RadioButton} from '@/components/@common/forms/RadioButton';
import {FieldRow} from '@/components/forms/common/FieldRow';
import styles from './ruleActionSwitcher.css';

export const RuleActionSwitcher = memo(function RuleActionSwitcher() {
	const name = 'actionType';
	const [field] = useField(name);

	return (
		<FieldRow className={styles.root} title='Action:'>
			{Object.entries(ruleActionsTypeHumanTitles)
				.filter(([value]) => value !== RuleActionsType.Breakpoint)
				.map(([value, title]) => (
					<div key={value} className={cn(styles.entry, field.value === value && styles.current)}>
						<RadioButton name={name} value={value}>
							{title}
						</RadioButton>
					</div>
				))}
		</FieldRow>
	);
});
