import * as React from 'react';
import {useFormikContext, getIn} from 'formik';
import styles from './radioTabs.css';
import {RadioButton} from '@/components/@common/RadioButton';

interface Props {
	radioName: string;
	tabs: {
		title: string;
		value: string;
	}[];
	children?(tab: string): React.ReactNode;
}

export const RadioTabs = React.memo(({tabs, radioName, children}: Props) => {
	//TODO use field
	const {values} = useFormikContext();
	const activeTabName = getIn(values, radioName);

	return (
		<div className={styles.root}>
			<div className={styles.radioWrapper}>
				{tabs.map(tab => (
					<RadioButton key={tab.value} className={styles.radioItem} name={radioName} value={tab.value}>
						{tab.title}
					</RadioButton>
				))}
			</div>

			{children && children(activeTabName)}
		</div>
	);
});
