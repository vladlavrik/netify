import React from 'react';
import {observer} from 'mobx-react-lite';
import {NetworkLogsHeader} from '../NetworkLogsHeader';
import {NetworkLogsList} from '../NetworkLogsList';
import styles from './logs.css';

export const Logs = observer(() => {
	return (
		<div className={styles.root}>
			<div className={styles.header}>
				<NetworkLogsHeader />
			</div>
			<div className={styles.content}>
				<NetworkLogsList />
			</div>
		</div>
	);
});

Logs.displayName = 'Logs';
