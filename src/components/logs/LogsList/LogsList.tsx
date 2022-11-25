import React from 'react';
import {observer} from 'mobx-react-lite';
import {useStores} from '@/stores/useStores';
import {LogsItem} from '../LogsItem';
import styles from './logsList.css';

export const LogsList = observer(() => {
	const {logsStore} = useStores();
	const {list} = logsStore;

	return list.length === 0 ? (
		<p className={styles.placeholder}>No logs here</p>
	) : (
		<ul className={styles.list}>
			{list.map((log) => (
				<LogsItem key={`${log.requestId}-${log.interceptStage}-${log.url}`} data={log} />
			))}
		</ul>
	);
});

LogsList.displayName = 'LogsList';
