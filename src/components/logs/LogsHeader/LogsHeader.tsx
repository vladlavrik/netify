import React, {memo, useCallback} from 'react';
import {useStore} from 'effector-react';
import {$hasLogs, clearLogsList} from '@/stores/logsStore';
import {SectionHeader} from '@/components/@common/misc/SectionHeader';
import {IconButton} from '@/components/@common/buttons/IconButton';
import styles from './logsHeader.css';

export const LogsHeader = memo(function LogsHeader() {
	const hasLogs = useStore($hasLogs);

	const handleClearList = useCallback(() => clearLogsList(), []);

	return (
		<SectionHeader title='Logs'>
			<IconButton
				className={styles.clearButton}
				tooltip='Clear log'
				disabled={!hasLogs}
				onClick={handleClearList}
			/>
		</SectionHeader>
	);
});
