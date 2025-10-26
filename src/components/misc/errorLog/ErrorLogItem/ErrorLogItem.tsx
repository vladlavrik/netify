import React from 'react';
import {observer} from 'mobx-react-lite';
import {ErrorLogEntry} from '@/interfaces/errorLog';
import styles from './errorLogItem.css';

interface ErrorLogItemProps {
	data: ErrorLogEntry;
}

export const ErrorLogItem = observer<ErrorLogItemProps>((props) => {
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

ErrorLogItem.displayName = 'ErrorLogItem';
