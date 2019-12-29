import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {observer, inject} from 'mobx-react';
import {Rule} from '@/interfaces/rule';
import {AppStore} from '@/stores/AppStore';
import {RulesStore} from '@/stores/RulesStore';
import {PopUpAlert} from '@/components/@common/popups/PopUpAlert';
import {Logs} from '@/components/Logs';
import {Rules} from '@/components/Rules';
import {RuleCompose, RuleEditor} from '@/components/forms/rule';
import {AppSeparatedSections} from './AppSeparatedSections';
import styles from './app.css';

interface Props {
	appStore?: AppStore;
	rulesStore?: RulesStore;
}

@inject('appStore', 'rulesStore')
@observer
export class App extends React.Component<Props> {
	private readonly modalTarget = document.getElementById('modal-root')!;

	render() {
		const {composeShown, sectionRatio, editingRule, displayedError} = this.props.appStore!;

		return (
			<div className={styles.root}>
				<AppSeparatedSections
					ratio={sectionRatio}
					minHeight={30}
					onRatioChange={this.onSectionsRatioChange}
					topSection={<Rules />}
					bottomSection={<Logs />}
				/>

				{composeShown &&
					ReactDOM.createPortal(
						<RuleCompose onSave={this.onSaveComposed} onCancel={this.onHideCompose} />,
						this.modalTarget,
					)}

				{editingRule && ReactDOM.createPortal(<RuleEditor rule={editingRule} />, this.modalTarget)}

				{displayedError && (
					<PopUpAlert onClose={this.onCloseErrorAlert}>
						<p className={styles.errorDisplay}>{displayedError}</p>
					</PopUpAlert>
				)}
			</div>
		);
	}

	private onSectionsRatioChange = (ratio: number, _: boolean, bottomEdgeReached: boolean) => {
		this.props.appStore!.setSectionRatio(ratio, bottomEdgeReached);
	};

	private onCloseErrorAlert = () => {
		this.props.appStore!.resetDisplayedError();
	};

	private onSaveComposed = (rule: Rule) => this.props.rulesStore!.create(rule);

	private onHideCompose = () => this.props.appStore!.hideCompose();

	private onSaveEdited = (rule: Rule) => this.props.rulesStore!.save(rule);

	private onCancelItemEdit = () => this.props.appStore!.hideRuleEditor();
}
