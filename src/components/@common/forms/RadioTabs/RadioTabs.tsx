import React, {FC, ReactNode} from 'react';
import {useField} from 'formik';
import {RadioButton} from '@/components/@common/forms/RadioButton';
import styles from './radioTabs.css';

interface RadioTabsProps {
	name: string;
	options: string[];
	optionTitleGetter(value: string): string;
	children?(tab: string): ReactNode;
}

export const RadioTabs: FC<RadioTabsProps> = ({name, options, optionTitleGetter, children}) => {
	const [field] = useField(name);

	return (
		<div className={styles.root}>
			<div className={styles.radioWrapper}>
				{options.map((option) => (
					<RadioButton key={option || 'empty'} className={styles.radioItem} name={name} value={option}>
						{optionTitleGetter(option)}
					</RadioButton>
				))}
			</div>

			{children && children(field.value)}
		</div>
	);
};

RadioTabs.displayName = 'RadioTabs';
