import React from 'react';
import {observer} from 'mobx-react-lite';
import {ErrorLogEntry} from '@/interfaces/errorLog';
import styles from './errorLogsItem.css';

interface ErrorLogsItemProps {
	data: ErrorLogEntry;
}

export const ErrorLogsItem = observer<ErrorLogsItemProps>((props) => {
	const {data} = props;
	const {title, details} = data;

	return (
		<li className={styles.root}>
			<details>
				<summary>{title}</summary>
				<pre className={styles.error}>{details}</pre>
			</details>
		</li>
	);
});

ErrorLogsItem.displayName = 'ErrorLogsItem';
