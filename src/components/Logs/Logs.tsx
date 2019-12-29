import * as React from 'react';
import {observer, inject} from 'mobx-react';
import classNames from 'classnames';
import {LogsStore} from '@/stores/LogsStore';
import {RulesStore} from '@/stores/RulesStore';
import {AppStore} from '@/stores/AppStore';
import {SectionHeader} from '@/components/@common/misc/SectionHeader';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {LogsItem} from './LogsItem';
import styles from './logs.css';

interface Props {
	logsStore?: LogsStore;
	rulesStore?: RulesStore;
	appStore?: AppStore;
}

@inject('logsStore')
@inject('rulesStore')
@inject('appStore')
@observer
export class Logs extends React.Component<Props> {
	render() {
		const {list, listIsEmpty} = this.props.logsStore!;
		const {logsCollapsed: collapsed} = this.props.appStore!;

		return (
			<div className={styles.root}>
				<SectionHeader title='Logs'>
					<IconButton
						className={classNames(styles.control, styles.typeClear)}
						tooltip='Clear log'
						disabled={listIsEmpty}
						onClick={this.onClearList}
					/>
					<IconButton
						className={classNames(styles.control, collapsed ? styles.typeExpand : styles.typeCollapse)}
						onClick={this.onToggleLogsCollapse}
					/>
				</SectionHeader>

				<div className={styles.content}>
					{list.length === 0 ? (
						<p className={styles.placeholder}>No logs here</p>
					) : (
						<ul className={styles.list}>
							{list.map(item => (
								<li key={item.id} className={styles.item}>
									<LogsItem
										ruleId={item.ruleId}
										date={item.date}
										url={item.url}
										resourceType={item.resourceType}
										method={item.method}
										loaded={item.loaded}
										onFollowRule={this.onFollowRule}
									/>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		);
	}

	private onFollowRule = (ruleId: string) => {
		if (this.props.rulesStore!.checkItemExists(ruleId)) {
			this.props.rulesStore!.setHighlighted(ruleId);
		} else {
			this.props.appStore!.setDisplayedError('The rule is not exist (maybe it was removed).');
		}
	};

	private onToggleLogsCollapse = () => this.props.appStore!.toggleLogsCollapse();

	private onClearList = () => this.props.logsStore!.clearList();
}
