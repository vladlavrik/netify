import * as React from 'react';
import {observer, inject} from 'mobx-react';
import {LogsStore} from './LogsStore';
import {LogsItem} from './LogsItem';
import styles from './logs.css';

interface Props {
	logsStore?: LogsStore;
}

@inject('logsStore')
@observer
export class Logs extends React.Component<Props> {
	render() {
		const {list} = this.props.logsStore!;
		if (list.length === 0) {
			return (
				<div className={styles.root}>
					<p className={styles.placeholder}>No logs here</p>
				</div>
			);
		}

		return (
			<div className={styles.root}>
				<ul className={styles.list}>
					{list.map(item => (
						<li className={styles.item} key={item.requestId}>
							<LogsItem data={item} />
						</li>
					))}
				</ul>
			</div>
		);
	}
}
