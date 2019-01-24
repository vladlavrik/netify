import * as React from 'react';
import {connect, FormikContext, getIn} from 'formik';
import styles from './radioTabs.css';
import {RadioButton} from '@/components/@common/RadioButton';


interface Props {
	radioName: string
	tabs: {
		title: string,
		value: string,
	}[];
	render: (tab: string) => React.ReactNode
}

interface FormikProps {
	formik: FormikContext<any>
}


class RadioTabsComponent extends React.PureComponent<Props & FormikProps> {
	render() {
		const {tabs, radioName, render, formik} = this.props;
		const activeTabName = getIn(formik.values, radioName);

		return (
			<div className={styles.root}>
				<div className={styles.radioWrapper}>
					{tabs.map(tab => (
						<RadioButton
							key={tab.value}
							className={styles.radioItem}
							name={radioName}
							value={tab.value}>
							{tab.title}
						</RadioButton>
					))}
				</div>

				{render(activeTabName)}
			</div>
		);
	}
}

export const RadioTabs = connect<Props>(RadioTabsComponent);
