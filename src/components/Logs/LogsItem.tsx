import * as React from 'react';
import {Log} from '@/debugger/interfaces/Log';
import {IconButton} from '@/components/@common/IconButton';
import {formatFullTime, formatTime} from '@/helpers/formatter';
import styles from './logsItem.css';

interface Props {
	data: Log;
}

export class LogsItem extends React.Component<Props> {
	render() {
		const {date, resourceType, method, url} = this.props.data;

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
				<IconButton className={styles.followButton} tooltip='Highlight rule' onClick={this.followRule} />
			</div>
		);
	}

	private followRule = () => {
		console.log('followRule');
	};
}
