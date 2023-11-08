import React, {memo} from 'react';
import cn from 'classnames';
import {useField} from 'formik';
import {ruleActionsTypeHumanTitles} from '@/constants/RuleActionsType';
import {RadioButton} from '@/components/@common/forms/RadioButton';
import {RuleRow} from '../RuleRow';
import styles from './ruleActionSwitcher.css';

export const RuleActionSwitcher = memo(() => {
	const name = 'actionType';
	const [field] = useField(name);

	return (
		<RuleRow className={styles.root} title={chrome.i18n.getMessage('action')}>
			<ul className={styles.list}>
				{Object.entries(ruleActionsTypeHumanTitles).map(([value, title]) => (
					<div key={value} className={cn(styles.entry, field.value === value && styles.current)}>
						<RadioButton {...field} value={value} checked={field.value === value}>
							{chrome.i18n.getMessage(title)}
						</RadioButton>
					</div>
				))}
			</ul>
		</RuleRow>
	);
});

RuleActionSwitcher.displayName = 'RuleActionSwitcher';
