import * as React from 'react';
import {observer, Provider} from 'mobx-react';
import classNames from 'classnames';
import {RootStore} from '@/stores/RootStore';
import {AppSectionHeader} from './AppSectionHeader';
import {AppSeparatedSections} from './AppSeparatedSections';
import {Logs} from '@/components/Logs';
import {Rules} from '@/components/Rules';
import {Compose} from '@/components/Compose';
import {IconButton} from '@/components/@common/IconButton';
import styles from './app.css';

@observer
export class App extends React.Component {
	private readonly rootStore = new RootStore();

	render() {
		const {composeShown, sectionRatio, logsCollapsed} = this.rootStore.appStore;
		const {debuggerDisabled, hasRules} = this.rootStore.rulesStore;
		const {hasLogs} = this.rootStore.logsStore;

		return (
			<Provider
				appStore={this.rootStore.appStore}
				rulesStore={this.rootStore.rulesStore}
				logsStore={this.rootStore.logsStore}>
				<div className={styles.root}>
					<AppSeparatedSections
						ratio={sectionRatio}
						minHeight={30}
						onRatioChange={this.onSectionsRatioChange}
						topSection={
							<React.Fragment>
								<AppSectionHeader title='Rules'>
									<IconButton
										className={classNames({
											[styles.headerControl]: true,
											[styles.typeAdd]: !composeShown,
											[styles.typeClose]: composeShown,
										})}
										tooltip={composeShown ? 'Cancel add' : 'Add rule'}
										onClick={this.onToggleComposeShow}
									/>
									<IconButton
										className={classNames({
											[styles.headerControl]: true,
											[styles.typeStartListen]: debuggerDisabled || !hasRules,
											[styles.typeStopListen]: !debuggerDisabled && hasRules,
										})}
										disabled={composeShown || !hasRules}
										tooltip={debuggerDisabled ? 'Enable debugger' : 'Disable debugger'}
										onClick={this.onToggleDebuggerEnabled}
									/>
									<IconButton
										className={classNames(styles.headerControl, styles.typeClear)}
										disabled={composeShown || !hasRules}
										tooltip='Clear all rules'
										onClick={this.onClearRules}
									/>
								</AppSectionHeader>
								<div className={styles.sectionContent}>
									<Rules />
								</div>
							</React.Fragment>
						}
						bottomSection={
							<React.Fragment>
								<AppSectionHeader title='Logs'>
									<IconButton
										className={classNames(styles.headerControl, styles.typeClear)}
										tooltip='Clear log'
										disabled={!hasLogs}
										onClick={this.onClearLogs}
									/>
									<IconButton
										className={classNames({
											[styles.headerControl]: true,
											[styles.typeCollapse]: !logsCollapsed,
											[styles.typeExpand]: logsCollapsed,
										})}
										onClick={this.onToggleLogsCollapse}
									/>
								</AppSectionHeader>
								<div className={styles.sectionContent}>
									<Logs />
								</div>
							</React.Fragment>
						}
					/>

					{composeShown && (
						<div className={styles.compose}>
							<Compose />
						</div>
					)}
				</div>
			</Provider>
		);
	}

	private onSectionsRatioChange = (ratio: number, _: boolean, bottomEdgeReached: boolean) => {
		this.rootStore.appStore.setSectionRatio(ratio, bottomEdgeReached);
	};

	private onToggleComposeShow = () => this.rootStore.appStore.toggleComposeShow();

	private onToggleDebuggerEnabled = () => this.rootStore.rulesStore.toggleDebuggerDisabled();

	private onToggleLogsCollapse = () => this.rootStore.appStore.toggleLogsCollapse();

	private onClearRules = () => this.rootStore.rulesStore.clearAll(); // TODO confirm with popup

	private onClearLogs = () => this.rootStore.logsStore.clearAll();
}
