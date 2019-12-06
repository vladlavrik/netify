import * as React from 'react';
import {EditorRow} from './EditorRow';
import {DropdownPicker} from '@/components/@common/DropdownPicker';
import {requestErrorReasonsList} from '@/constants/ResponseErrorReason';
import styles from './editorActionCancel.css';

export const EditorActionCancel = React.memo(() => (
	<div className={styles.root}>
		<EditorRow title='Reason:'>
			<DropdownPicker
				className={styles.reasonField}
				name='actions.cancel.reason'
				options={requestErrorReasonsList}
			/>
		</EditorRow>
	</div>
));
