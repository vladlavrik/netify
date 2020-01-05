import React, {memo, useCallback} from 'react';
import classNames from 'classnames';
import {Log} from '@/interfaces/log';
import {ResourceType} from '@/constants/ResourceType';
import {RequestMethod} from '@/constants/RequestMethod';
import {formatFullTime, formatTime} from '@/helpers/dateFormat';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {WithTooltip} from '@/components/@common/misc/WithTooltip';
import styles from './logsItem.css';

type RequestStage = Log['requestStage'];

const stageTitle: Record<RequestStage, string> = {
	Request: 'On request stage',
	Response: 'On response stage',
	Both: 'On request and response stages',
};

const stageIcon: Record<RequestStage, string> = {
	Request: styles.request,
	Response: styles.response,
	Both: styles.both,
};

interface LogsItemProps {
	ruleId: string;
	requestStage: RequestStage;
	date: Date;
	url: string;
	resourceType: ResourceType;
	method: RequestMethod;
	onFollowRule(ruleId: string): void;
}

export const LogsItem = memo<LogsItemProps>(props => {
	const {ruleId, requestStage, date, url, resourceType, method, onFollowRule} = props;

	const handleRuleFollow = useCallback(() => onFollowRule(ruleId), [ruleId, onFollowRule]);

	const fullDate = formatFullTime(date);
	const formattedTime = formatTime(date);

	return (
		<div className={styles.root}>
			<span className={styles.time} title={fullDate}>
				{formattedTime}
			</span>
			<WithTooltip tooltip={stageTitle[requestStage]}>
				<div className={classNames(styles.stage, stageIcon[requestStage])} />
			</WithTooltip>
			<span className={styles.method}>{method}</span>
			<span className={styles.type}>{resourceType}</span>
			<span className={styles.url} title={url}>
				{url}
			</span>
			<IconButton className={styles.followButton} tooltip='Highlight rule' onClick={handleRuleFollow} />
		</div>
	);
});

LogsItem.displayName = 'LogsItem';
