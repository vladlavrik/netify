import React from 'react';
import {observer} from 'mobx-react-lite';
import {LogEntry} from '@/interfaces/log';
import {formatFullTime, formatTime} from '@/helpers/dateFormat';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {WithTooltip} from '@/components/@common/misc/WithTooltip';
import {useStores} from '@/stores/useStores';
import BothIcon from './icons/both.svg';
import FollowIcon from './icons/follow.svg';
import RequestIcon from './icons/request.svg';
import ResponseIcon from './icons/response.svg';
import styles from './logsItem.css';

type InterceptStage = LogEntry['interceptStage'];

const stageTitle: Record<InterceptStage, string> = {
	Request: 'On request stage',
	Response: 'On response stage',
	Both: 'On request and response stages',
};

interface LogsItemProps {
	data: LogEntry;
}

export const LogsItem = observer<LogsItemProps>((props) => {
	const {data} = props;
	const {ruleId, url, resourceType, method, interceptStage, timestamp} = data;

	const {rulesStore} = useStores();

	const handleRuleFollow = () => {
		rulesStore.showDetails(ruleId);
	};

	const date = new Date(timestamp);
	const fullDate = formatFullTime(date);
	const formattedTime = formatTime(date);

	return (
		<li className={styles.root}>
			<span className={styles.time} title={fullDate}>
				{formattedTime}
			</span>
			<WithTooltip className={styles.stage} tooltip={stageTitle[interceptStage]}>
				{interceptStage === 'Both' && <BothIcon />}
				{interceptStage === 'Request' && <RequestIcon />}
				{interceptStage === 'Response' && <ResponseIcon />}
			</WithTooltip>
			<span className={styles.method}>{method}</span>
			<span className={styles.type}>{resourceType}</span>
			<span className={styles.url} title={url}>
				/{url.split('/').slice(3).join('/') /* Skip an url origin part */}
			</span>
			<IconButton
				className={styles.followButton}
				icon={<FollowIcon />}
				tooltip='Follow a rule'
				onClick={handleRuleFollow}
			/>
		</li>
	);
});

LogsItem.displayName = 'LogsItem';
