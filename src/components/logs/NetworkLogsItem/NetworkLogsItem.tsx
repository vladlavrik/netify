import React from 'react';
import {observer} from 'mobx-react-lite';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {NetworkLogEntry} from '@/interfaces/networkLog';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {Dropdown} from '@/components/@common/misc/Dropdown';
import {WithTooltip} from '@/components/@common/misc/WithTooltip';
import {NetworkLogItemControls} from '@/components/logs/NetworkLogItemControls';
import MoreIcon from '@/assets/icons/more.svg';
import RequestActionBreakpointIcon from '@/assets/icons/request-action-breakpoint.svg';
import RequestActionFailedIcon from '@/assets/icons/request-action-failed.svg';
import RequestActionLocalResponseIcon from '@/assets/icons/request-action-local-response.svg';
import RequestActionMutationIcon from '@/assets/icons/request-action-mutation.svg';
import RequestActionNoneIcon from '@/assets/icons/request-action-none.svg';
import RequestActionScriptIcon from '@/assets/icons/request-action-script.svg';
import styles from './networkLogsItem.css';

type InterceptStage = NonNullable<NetworkLogEntry['modification']>['stage'];

const modificationStageTitle: Record<InterceptStage, string> = {
	Request: 'request stage',
	Response: 'response stage',
	Both: 'request and response stages',
};

interface NetworkLogsItemProps {
	data: NetworkLogEntry;
}

export const NetworkLogsItem = observer<NetworkLogsItemProps>((props) => {
	const {data} = props;
	const {url, resourceType, method, modification, timestamp, responseStatusCode, responseError} = data;

	const date = new Date(timestamp);
	const fullDate = date.toLocaleDateString('en-US', {
		year: 'numeric',
		day: 'numeric',
		month: 'short',
		minute: '2-digit',
		second: '2-digit',
	});
	const fillDateWithMs = `${fullDate}, ${date.getMilliseconds().toString().padStart(3, '0')}ms`;
	const formattedTime = date.toLocaleString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	});

	let actionIcon;
	let actionIconTitle;

	switch (modification?.type) {
		case RuleActionsType.Mutation:
			actionIcon = <RequestActionMutationIcon className={styles.actionIconMutation} />;
			actionIconTitle = `Modified by a rule on ${modificationStageTitle[modification.stage]}`;
			break;
		case RuleActionsType.Breakpoint:
			actionIcon = <RequestActionBreakpointIcon className={styles.actionIconBreakpoint} />;
			actionIconTitle = `Breakpoint on ${modificationStageTitle[modification.stage]}`;
			break;
		case RuleActionsType.LocalResponse:
			actionIcon = <RequestActionLocalResponseIcon className={styles.actionIconLocalResponse} />;
			actionIconTitle = 'Used a local response\n(without sending to server)';
			break;
		case RuleActionsType.Failure:
			actionIcon = <RequestActionFailedIcon className={styles.actionIconFailed} />;
			actionIconTitle = 'Was sailure';
			break;
		case RuleActionsType.Script:
			actionIcon = <RequestActionScriptIcon className={styles.actionIconScript} />;
			actionIconTitle = `Processed by a script on ${modificationStageTitle[modification.stage]}`;
			break;
		default:
			actionIcon = <RequestActionNoneIcon className={styles.actionIconNoAction} />;
			actionIconTitle = 'No action applied';
	}

	return (
		<li className={styles.root}>
			<span className={styles.time} title={fillDateWithMs}>
				{formattedTime}
			</span>

			<WithTooltip className={styles.action} tooltip={actionIconTitle}>
				{actionIcon}
			</WithTooltip>

			<WithTooltip className={styles.method} tagName='span' tooltip='Request method'>
				{method}
			</WithTooltip>
			<WithTooltip className={styles.type} tagName='span' tooltip='Resource type'>
				{resourceType}
			</WithTooltip>
			{responseStatusCode && (
				<WithTooltip className={styles.status} tagName='span' tooltip='Response status code'>
					{responseStatusCode}
				</WithTooltip>
			)}
			{responseError && (
				<WithTooltip
					className={styles.status}
					tagName='span'
					tooltip={`Response failed with error:\n${responseError}`}>
					Err
				</WithTooltip>
			)}
			{responseStatusCode === undefined && responseError === undefined && (
				<WithTooltip className={styles.status} tagName='span' tooltip='Request pending'>
					...
				</WithTooltip>
			)}
			<WithTooltip className={styles.url} tagName='span' tooltip={url}>
				/{url.split('/').slice(3).join('/') /* Skip an url origin part */}
			</WithTooltip>

			<Dropdown
				className={styles.controlsButton}
				render={(dropdownProps, {expanded}) => (
					<IconButton {...dropdownProps} icon={<MoreIcon />} active={expanded} />
				)}
				content={({collapse}) => <NetworkLogItemControls data={data} onClose={collapse} />}
			/>
		</li>
	);
});

NetworkLogsItem.displayName = 'NetworkLogsItem';
