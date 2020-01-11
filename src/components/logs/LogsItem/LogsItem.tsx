import React, {memo, useCallback} from 'react';
import classNames from 'classnames';
import {Log} from '@/interfaces/log';
import {ResourceType} from '@/constants/ResourceType';
import {RequestMethod} from '@/constants/RequestMethod';
import {formatFullTime, formatTime} from '@/helpers/dateFormat';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {WithTooltip} from '@/components/@common/misc/WithTooltip';
import styles from './logsItem.css';

type InterceptStage = Log['interceptStage'];

const stageTitle: Record<InterceptStage, string> = {
	Request: 'On request stage',
	Response: 'On response stage',
	Both: 'On request and response stages',
};

const stageIcon: Record<InterceptStage, string> = {
	Request: styles.request,
	Response: styles.response,
	Both: styles.both,
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

export const LogsItem = memo<LogsItemProps>(props => {
	const {ruleId, interceptStage, date, url, resourceType, method, onFollowRule} = props;

	const handleRuleFollow = useCallback(() => onFollowRule(ruleId), [ruleId, onFollowRule]);

	const fullDate = formatFullTime(date);
	const formattedTime = formatTime(date);

	return (
		<li className={styles.root}>
			<span className={styles.time} title={fullDate}>
				{formattedTime}
			</span>
			<WithTooltip tooltip={stageTitle[interceptStage]}>
				<div className={classNames(styles.stage, stageIcon[interceptStage])} />
			</WithTooltip>
			<span className={styles.method}>{method}</span>
			<span className={styles.type}>{resourceType}</span>
			<span className={styles.url} title={url}>
				{url}
			</span>
			<IconButton className={styles.followButton} tooltip='Follow a rule' onClick={handleRuleFollow} />
		</li>
	);
});

LogsItem.displayName = 'LogsItem';
