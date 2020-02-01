import React, {memo, useCallback} from 'react';
import {Log} from '@/interfaces/log';
import {ResourceType} from '@/constants/ResourceType';
import {RequestMethod} from '@/constants/RequestMethod';
import {formatFullTime, formatTime} from '@/helpers/dateFormat';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {WithTooltip} from '@/components/@common/misc/WithTooltip';
import RequestIcon from './icons/request.svg';
import ResponseIcon from './icons/response.svg';
import BothIcon from './icons/both.svg';
import FollowIcon from './icons/follow.svg';
import styles from './logsItem.css';

type InterceptStage = Log['interceptStage'];

const stageTitle: Record<InterceptStage, string> = {
	Request: 'On request stage',
	Response: 'On response stage',
	Both: 'On request and response stages',
};

interface LogsItemProps {
	ruleId: string;
	interceptStage: InterceptStage;
	date: Date;
	url: string;
	resourceType: ResourceType;
	method: RequestMethod;
	onFollowRule(ruleId: string): void;
}

export const LogsItem = memo<LogsItemProps>(function LogsItem(props) {
	const {ruleId, interceptStage, date, url, resourceType, method, onFollowRule} = props;

	const handleRuleFollow = useCallback(() => onFollowRule(ruleId), [ruleId, onFollowRule]);

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
				/
				{url
					.split('/')
					.slice(3)
					.join('/') /* Skip an origin part */}
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
