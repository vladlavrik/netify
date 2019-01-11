import * as React from 'react';
import {observer, inject} from 'mobx-react';
import {Log} from '@/debugger/constants/Log'
import {RequestTypes} from '@/debugger/constants/RequestTypes';
import {RequestMethods} from '@/debugger/constants/RequestMethods';
import {LogsStore} from './LogsStore';
import {LogsItem} from './LogsItem';
import styles from './logs.css';

const logs: Log[] = [{
	requestId: 0,
	ruleId: 0,
	date: new Date(),
	requestType: RequestTypes.Fetch,
	method: RequestMethods.GET,
	url: 'https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G',
}, {
	requestId: 1,
	ruleId: 0,
	date: new Date(),
	requestType: RequestTypes.Fetch,
	method: RequestMethods.GET,
	url: 'https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G',
}, {
	requestId: 2,
	ruleId: 0,
	date: new Date(),
	requestType: RequestTypes.Fetch,
	method: RequestMethods.GET,
	url: 'https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G',
}];


interface Props {
	logsStore?: LogsStore
}

@inject('logsStore')
@observer
export class Logs extends React.Component<Props> {

	render() {
		console.log(this.props);

		if (logs.length === 0) {
			return (
				<div className={styles.root}>
					<p className={styles.placeholder}>No logs here</p>
				</div>
			);
		}

		return (
			<div className={styles.root}>
				<ul className={styles.list}>
					{logs.map(log => (
						<li className={styles.item} key={log.requestId}>
							<LogsItem data={log}/>
						</li>
					))}
				</ul>
			</div>
		);
	}
}
