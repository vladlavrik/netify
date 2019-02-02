import * as React from 'react';
import {observer, Provider} from 'mobx-react';
import {RootStore} from '@/stores/RootStore';
import {PopUpAlert} from '@/components/@common/PopUpAlert';
import {Logs} from '@/components/Logs';
import {Rules} from '@/components/Rules';
import {Compose} from '@/components/Compose';
import {AppSeparatedSections} from './AppSeparatedSections';
import styles from './app.css';

@observer
export class App extends React.Component {
	private readonly rootStore = new RootStore();

	render() {
		const {composeShown, sectionRatio, displayedError} = this.rootStore.appStore;

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
						topSection={<Rules />}
						bottomSection={<Logs />}
					/>

					{composeShown && (
						<div className={styles.compose}>
							<Compose />
						</div>
					)}

					{displayedError && (
						<PopUpAlert onClose={this.onCloseErrorAlert}>
							<p className={styles.errorDisplay}>{displayedError}</p>
						</PopUpAlert>
					)}
				</div>
			</Provider>
		);
	}

	private onSectionsRatioChange = (ratio: number, _: boolean, bottomEdgeReached: boolean) => {
		this.rootStore.appStore.setSectionRatio(ratio, bottomEdgeReached);
	};

	private onCloseErrorAlert = () => {
		this.rootStore.appStore.resetDisplayedError();
	};
}
