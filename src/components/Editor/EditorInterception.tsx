import * as React from 'react';
import {Checkbox} from '@/components/@common/Checkbox';
import styles from './editorInterception.css';

export const EditorInterception = React.memo(() => (
	<div className={styles.root}>
		<Checkbox className={styles.option} name='intercept.request'>
			On request
		</Checkbox>
		<Checkbox className={styles.option} name='intercept.response'>
			On response
		</Checkbox>
	</div>
));
