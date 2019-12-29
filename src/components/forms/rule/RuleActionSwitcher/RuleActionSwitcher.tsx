import React, {memo} from 'react';
import {useField} from 'formik';
import classNames from 'classnames';
import {ActionsType} from '@/constants/ActionsType';
import {RadioButton} from '@/components/@common/forms/RadioButton';
import {FieldRow} from '@/components/forms/common/FieldRow';
import styles from './ruleActionSwitcher.css';

const options = {
	// [ActionsType.Breakpoint]: 'Breakpoint', | TODO future
	[ActionsType.Mutation]: 'Mutation',
	[ActionsType.LocalResponse]: 'Local response',
	[ActionsType.Failure]: 'Failure',
};

export const RuleActionSwitcher = memo(() => {
	const name = 'actionType';
	const [field] = useField(name);

	return (
		<FieldRow className={styles.root} title='Action:'>
			{Object.entries(options).map(([value, title]) => (
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
