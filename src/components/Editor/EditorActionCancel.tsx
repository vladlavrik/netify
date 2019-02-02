import * as React from 'react';
import {EditorRow} from './EditorRow';
import {DropdownPicker} from '@/components/@common/DropdownPicker';
import {cancelReasonsList} from '@/constants/CancelReasons';
import styles from './editorActionCancel.css';

interface Props {}

export class EditorActionCancel extends React.PureComponent<Props> {
	render() {
		return (
			<div className={styles.root}>
				<EditorRow title='Reason:'>
					<DropdownPicker
						className={styles.reasonField}
						name='actions.cancelRequest.reason'
						options={cancelReasonsList}
					/>
				</EditorRow>
			</div>
		);
	}
}
