import React from 'react';
import {observer} from 'mobx-react-lite';
import {useStores} from '@/stores/useStores';
import {NetworkLogsItem} from '../NetworkLogsItem';
import styles from './networkLogsList.css';

export const NetworkLogsList = observer(() => {
	const {networkLogsStore} = useStores();
	const {list} = networkLogsStore;

	return list.length === 0 ? (
		<p className={styles.placeholder}>No logs here</p>
	) : (
		<ul>
			{list.map((log) => (
				<NetworkLogsItem key={`${log.requestId}-${log.interceptStage}-${log.url}`} data={log} />
			))}
		</ul>
	);
});

NetworkLogsList.displayName = 'NetworkLogsList';
