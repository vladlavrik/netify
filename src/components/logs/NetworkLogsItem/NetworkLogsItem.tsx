import React from 'react';
import {observer} from 'mobx-react-lite';
import {NetworkLogEntry} from '@/interfaces/networkLog';
import {formatFullTime, formatTime} from '@/helpers/dateFormat';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {WithTooltip} from '@/components/@common/misc/WithTooltip';
import {useStores} from '@/stores/useStores';
import BothIcon from './icons/both.svg';
import FollowIcon from './icons/follow.svg';
import RequestIcon from './icons/request.svg';
import ResponseIcon from './icons/response.svg';
import styles from './networkLogsItem.css';

type InterceptStage = NetworkLogEntry['interceptStage'];

const stageTitle: Record<InterceptStage, string> = {
	Request: 'On request stage',
	Response: 'On response stage',
	Both: 'On request and response stages',
};

interface NetworkLogsItemProps {
	data: NetworkLogEntry;
}

export const NetworkLogsItem = observer<NetworkLogsItemProps>((props) => {
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
			<WithTooltip
				className={styles.stage}
				tooltip={stageTitle[interceptStage]}
				render={(tooltipTargetProps) => (
					<div {...tooltipTargetProps}>
						{interceptStage === 'Both' && <BothIcon />}
						{interceptStage === 'Request' && <RequestIcon />}
						{interceptStage === 'Response' && <ResponseIcon />}
					</div>
				)}
			/>
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

NetworkLogsItem.displayName = 'NetworkLogsItem';
