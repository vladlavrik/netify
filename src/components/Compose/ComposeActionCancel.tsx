import * as React from 'react';
import {DropdownPicker} from '@/components/@common/DropdownPicker';
import {cancelReasonsList} from '@/debugger/constants/CancelReasons';
import styles from './composeActionCancel.css';

interface Props {}

export class ComposeActionCancel extends React.Component<Props> {
	render() {
		return (
			<div className={styles.root}>
				<DropdownPicker


					className={styles.reasonField}
					name='responseError.reason'
					options={cancelReasonsList}
				/>
			</div>
		);
	}
}
