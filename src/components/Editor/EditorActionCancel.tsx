import * as React from 'react';
import {EditorRow} from './EditorRow';
import {DropdownPicker} from '@/components/@common/DropdownPicker';
import {cancelReasonsList} from '@/constants/CancelReasons';
import styles from './editorActionCancel.css';

export const EditorActionCancel = React.memo(() => (
	<div className={styles.root}>
		<EditorRow title='Reason:'>
			<DropdownPicker
				className={styles.reasonField}
				name='actions.cancel.reason'
				options={cancelReasonsList}
			/>
		</EditorRow>
	</div>
));
