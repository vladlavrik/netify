import React, {memo, ReactNode} from 'react';
import {useField} from 'formik';
import {RadioButton} from '@/components/@common/forms/RadioButton';
import styles from './radioTabs.css';

interface RadioTabsProps {
	radioName: string;
	tabs: {
		title: string;
		value: string;
	}[];
	children?(tab: string): ReactNode;
}

export const RadioTabs = memo<RadioTabsProps>(({tabs, radioName, children}) => {
	const [field] = useField(radioName);

	return (
		<div className={styles.root}>
			<div className={styles.radioWrapper}>
				{tabs.map(tab => (
					<RadioButton key={tab.value} className={styles.radioItem} name={radioName} value={tab.value}>
						{tab.title}
					</RadioButton>
				))}
			</div>

			{children && children(field.value)}
		</div>
	);
});

RadioTabs.displayName = 'RadioTabs';
