import * as React from 'react';
import classNames from 'classnames';
import {ResourceType} from '@/constants/ResourceType';
import {RequestMethod} from '@/constants/RequestMethod';
import {formatFullTime, formatTime} from '@/helpers/dateFormat';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {WithTooltip} from '@/components/@common/misc/WithTooltip';
import styles from './logsItem.css';

interface Props {
	ruleId: string;
	requestStage: 'Request' | 'Response';
	date: Date;
	url: string;
	resourceType: ResourceType;
	method: RequestMethod;
	onFollowRule(ruleId: string): void;
}

export class LogsItem extends React.PureComponent<Props> {
	render() {
		const {date, url, resourceType, method, requestStage} = this.props;

		const fullDate = formatFullTime(date);
		const formattedTime = formatTime(date);

		return (
			<div className={styles.root}>
				<span className={styles.time} title={fullDate}>
					{formattedTime}
				</span>
				<WithTooltip tooltip={requestStage === 'Request' ? 'On request stage' : 'On response stage'}>
					<div
						className={classNames(
							styles.stage,
							requestStage === 'Request' ? styles.request : styles.response,
						)}
					/>
				</WithTooltip>
				<span className={styles.method}>{method}</span>
				<span className={styles.type}>{resourceType}</span>
				<span className={styles.url} title={url}>
					{url}
				</span>
				<IconButton className={styles.followButton} tooltip='Highlight rule' onClick={this.followRule} />
			</div>
		);
	}

	private followRule = () => {
		this.props.onFollowRule(this.props.ruleId);
	};
}
