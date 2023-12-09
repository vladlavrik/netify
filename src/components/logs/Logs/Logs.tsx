import React from 'react';
import cn from 'classnames';
import {observer} from 'mobx-react-lite';
import {useStores} from '@/stores/useStores';
import {ErrorLogsHeader} from '../ErrorLogsHeader';
import {ErrorLogsList} from '../ErrorLogsList';
import {NetworkLogsHeader} from '../NetworkLogsHeader';
import {NetworkLogsList} from '../NetworkLogsList';
import styles from './logs.css';

export const Logs = observer(() => {
	const {errorLogsStore} = useStores();
	const hasErrorLogs = errorLogsStore.hasLogs;

	return (
		<div className={styles.root}>
			<div className={cn(styles.section, styles.isPrimary)}>
				<div className={styles.header}>
					<NetworkLogsHeader />
				</div>
				<div className={styles.content}>
					<NetworkLogsList />
				</div>
			</div>

			{hasErrorLogs && (
				<div className={cn(styles.section, styles.isSecondary)}>
					<div className={styles.header}>
						<ErrorLogsHeader />
					</div>
					<div className={styles.content}>
						<ErrorLogsList />
					</div>
				</div>
			)}
		</div>
	);
});

Logs.displayName = 'Logs';
