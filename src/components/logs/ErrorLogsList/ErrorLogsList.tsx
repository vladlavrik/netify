import React from 'react';
import {observer} from 'mobx-react-lite';
import {useStores} from '@/stores/useStores';
import {ErrorLogsItem} from '../ErrorLogsItem';
import styles from './errorLogsList.css';

export const ErrorLogsList = observer(() => {
	const {errorLogsStore} = useStores();
	const {list} = errorLogsStore;

	// TODO add id
	return (
		<ul className={styles.root}>
			{list.map((data, index) => (
				// eslint-disable-next-line react/no-array-index-key
				<ErrorLogsItem key={index} data={data} />
			))}
		</ul>
	);
});

ErrorLogsList.displayName = 'ErrorLogsList';
