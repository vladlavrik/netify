import * as React from 'react';
import {Checkbox} from '@/components/@common/Checkbox';
import styles from './editorBreakpoint.css';

export const EditorBreakpoint = React.memo(() => (
	<div className={styles.root}>
		<Checkbox className={styles.option} name='actions.breakpoint.request'>
			On request
		</Checkbox>
		<Checkbox className={styles.option} name='actions.breakpoint.response'>
			On response
		</Checkbox>
	</div>
));
