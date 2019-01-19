import * as React from 'react';
import {observer, inject} from 'mobx-react';
import {LogsStore} from '@/stores/LogsStore';
import {RulesStore} from '@/stores/RulesStore';
import {LogsItem} from './LogsItem';
import styles from './logs.css';

interface Props {
	logsStore?: LogsStore;
	rulesStore?: RulesStore;
}

@inject('logsStore')
@inject('rulesStore')
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
						<li className={styles.item} key={item.id}>
							<LogsItem
								ruleId={item.ruleId}
								date={item.date}
								url={item.url}
								resourceType={item.resourceType}
								method={item.method}
								loaded={item.loaded}
								onFollowRule={this.onFollowRule}/>
						</li>
					))}
				</ul>
			</div>
		);
	}

	onFollowRule = (ruleId: string) => {
		// TODO notify user if no the rule yet
		this.props.rulesStore!.setHighlighted(ruleId);
	}
}
