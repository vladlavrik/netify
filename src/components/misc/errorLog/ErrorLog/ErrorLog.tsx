import React from 'react';
import {observer} from 'mobx-react-lite';
import {useStores} from '@/stores/useStores';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {ErrorLogItem} from '../ErrorLogItem';
import ClearIcon from '@/assets/icons/clear.svg';
import CloseIcon from '@/assets/icons/close.svg';
import styles from './errorLog.css';

interface ErrorLogProps {
	onClose(): void;
}

export const ErrorLog = observer<ErrorLogProps>((props) => {
	const {onClose} = props;

	const {errorLogsStore} = useStores();
	const {list} = errorLogsStore;

	const handleClean = () => {
		errorLogsStore.cleanList();
	};

	return (
		<div className={styles.root}>
			<div className={styles.header}>
				<p className={styles.title}>Error log</p>
				<IconButton
					className={styles.tailButton}
					icon={<ClearIcon />}
					tooltip='Clear log'
					disabled={list.length === 0}
					onClick={handleClean}
				/>
				<IconButton className={styles.tailButton} icon={<CloseIcon />} tooltip='Close log' onClick={onClose} />
			</div>
			<ul className={styles.list}>
				{list.map((data, index) => (
					// eslint-disable-next-line react/no-array-index-key
					<ErrorLogItem key={index} data={data} />
				))}
			</ul>
		</div>
	);
});

ErrorLog.displayName = 'ErrorLog';
