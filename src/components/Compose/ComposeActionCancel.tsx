import * as React from 'react';
import {ComposeRow} from '@/components/Compose/ComposeRow';
import {DropdownPicker} from '@/components/@common/DropdownPicker';
import {cancelReasonsList} from '@/constants/CancelReasons';
import styles from './composeActionCancel.css';

interface Props {}

export class ComposeActionCancel extends React.PureComponent<Props> {
	render() {
		return (
			<div className={styles.root}>
				<ComposeRow title='Reason:'>
					<DropdownPicker
						className={styles.reasonField}
						name='actions.cancelRequest.reason'
						options={cancelReasonsList}
					/>
				</ComposeRow>
			</div>
		);
	}
}
