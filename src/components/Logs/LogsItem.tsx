import * as React from 'react';
import {ResourceType} from '@/constants/ResourceType';
import {RequestMethod} from '@/constants/RequestMethod';
import {IconButton} from '@/components/@common/IconButton';
import {formatFullTime, formatTime} from '@/helpers/formatter';
import styles from './logsItem.css';
import {WithTooltip} from '@/components/@common/WithTooltip';

interface Props {
	ruleId: string;
	date: Date;
	url: string;
	resourceType: ResourceType;
	method: RequestMethod;
	loaded: boolean;
	onFollowRule(ruleId: string): void;
}

export class LogsItem extends React.PureComponent<Props> {
	render() {
		const {date, url, resourceType, method, loaded} = this.props;

		const fullDate = formatFullTime(date);
		const formattedTime = formatTime(date);

		return (
			<div className={styles.root}>
				<span className={styles.time} title={fullDate}>
					{formattedTime}
				</span>
				<span className={styles.method}>{method}</span>
				<span className={styles.type}>{resourceType}</span>
				<span className={styles.url} title={url}>
					{url}
				</span>
				{!loaded && (
					<WithTooltip tooltip='Request wait to response'>
						<div className={styles.loading} />
					</WithTooltip>
				)}
				<IconButton className={styles.followButton} tooltip='Highlight rule' onClick={this.followRule} />
			</div>
		);
	}

	private followRule = () => {
		this.props.onFollowRule(this.props.ruleId);
	};
}
