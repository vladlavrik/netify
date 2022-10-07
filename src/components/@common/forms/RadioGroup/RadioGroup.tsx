import React, {FC} from 'react';
import {RadioButton, RadioButtonProps} from '@/components/@common/forms/RadioButton';
import styles from './radioGroup.css';

interface RadioTabsProps extends Omit<RadioButtonProps, 'value' | 'type' | 'checked'> {
	options: string[];
	optionTitleGetter(value: string): string;
	value: string;
	onChange(event: React.ChangeEvent<HTMLInputElement>): void;
}

export const RadioGroup: FC<RadioTabsProps> = (props) => {
	const {options, value, optionTitleGetter, ...radioButtonProps} = props;

	return (
		<div className={styles.root}>
			{options.map((option) => (
				<RadioButton
					key={option || 'empty'}
					className={styles.option}
					value={option}
					checked={option === value}
					{...radioButtonProps}>
					{optionTitleGetter(option)}
				</RadioButton>
			))}
		</div>
	);
};

RadioGroup.displayName = 'RadioTabs';
