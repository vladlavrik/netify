import * as React from 'react';
import {Log} from '@/debugger/constants/Log';
import {IconButton} from '@/components/@common/IconButton';
import {formatFullTime, formatTime} from '@/utils/formatter';
import styles from './logsItem.css';


interface Props {
	data: Log
}

export class LogsItem extends React.Component<Props> {

	render() {
		const {/*requestId, ruleId,*/ date, requestType, method, url} = this.props.data;

		const fullDate = formatFullTime(date);
		const formattedTime = formatTime(date);

		return (
			<div className={styles.root}>
				<span className={styles.time} title={fullDate}>{formattedTime}</span>
				<span className={styles.method}>{method}</span>
				<span className={styles.type}>{requestType}</span>
				<span className={styles.url} title={url}>{url}</span>
				<IconButton
					className={styles.followButton}
					tooltip="Highlight rule"
					onClick={this.followRule}/>
			</div>
		);
	}

	private followRule = () => {
		console.log('followRule');
	};
}
