import React, {memo} from 'react';
import {LogsHeader} from '../LogsHeader';
import {LogsList} from '../LogsList';
import styles from './logs.css';

export const Logs = memo(function Logs() {
	return (
		<div className={styles.root}>
			<div className={styles.header}>
				<LogsHeader />
			</div>
			<div className={styles.content}>
				<LogsList />
			</div>
		</div>
	);
});
