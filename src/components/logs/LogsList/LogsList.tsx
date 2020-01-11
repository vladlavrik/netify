import React, {memo} from 'react';
import {useList, useStore} from 'effector-react';
import {showRuleDetails} from '@/stores/uiStore';
import {$logs, $hasLogs} from '@/stores/logsStore';
import {LogsItem} from '../LogsItem';
import styles from './logsList.css';

export const LogsList = memo(() => {
	const hasLogs = useStore($hasLogs);

	const listNode = useList($logs, log => (
		<LogsItem
			key={log.requestId + log.interceptStage}
			ruleId={log.ruleId}
			interceptStage={log.interceptStage}
			date={log.date}
			url={log.url}
			resourceType={log.resourceType}
			method={log.method}
			onFollowRule={showRuleDetails}
		/>
	));

	return hasLogs ? <ul className={styles.list}>{listNode}</ul> : <p className={styles.placeholder}>No logs here</p>;
});

LogsList.displayName = 'LogsList';
