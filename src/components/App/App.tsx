import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {observer, inject} from 'mobx-react';
import {Rule} from '@/interfaces/Rule';
import {AppStore} from '@/stores/AppStore';
import {RulesStore} from '@/stores/RulesStore';
import {InterceptsStore} from '@/stores/InterceptsStore';
import {InterceptedRequest} from '@/interfaces/InterceptedRequest';
import {InterceptedResponse} from '@/interfaces/InterceptedResponse';
import {PopUpAlert} from '@/components/@common/PopUpAlert';
import {Logs} from '@/components/Logs';
import {Rules} from '@/components/Rules';
import {Editor} from '@/components/Editor';
import {RequestInterceptor, ResponseInterceptor} from '@/components/Interceptor';
import {AppSeparatedSections} from './AppSeparatedSections';
import styles from './app.css';

interface Props {
	appStore?: AppStore;
	rulesStore?: RulesStore;
	interceptsStore?: InterceptsStore;
}

@inject('appStore', 'rulesStore', 'interceptsStore')
@observer
export class App extends React.Component<Props> {
	private readonly modalTarget = document.getElementById('modal-root')!;

	render() {
		const {sectionRatio, composeShown, editingRule, displayedError} = this.props.appStore!;
		const {activeIntercepted} = this.props.interceptsStore!;

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
						<Editor onSave={this.onSaveComposed} onCancel={this.onHideCompose} />,
						this.modalTarget,
					)}

				{editingRule &&
					ReactDOM.createPortal(
						<Editor
							initialValues={editingRule}
							onSave={this.onSaveEdited}
							onCancel={this.onCancelItemEdit}
						/>,
						this.modalTarget,
					)}

				{activeIntercepted &&
					(activeIntercepted as InterceptedRequest).isRequest &&
					ReactDOM.createPortal(
						<RequestInterceptor
							data={activeIntercepted as InterceptedRequest}
							onExecute={this.onExecuteIntercepted}
							onLocalResponse={this.onLocalResponseIntercepted}
							onAbort={this.onAbortIntercepted}
						/>,
						document.getElementById('modal-root')!,
					)}

				{activeIntercepted &&
					(activeIntercepted as InterceptedResponse).isResponse &&
					ReactDOM.createPortal(
						<ResponseInterceptor
							data={activeIntercepted as InterceptedResponse}
							onExecute={this.onExecuteIntercepted}
							onAbort={this.onAbortIntercepted}
						/>,
						document.getElementById('modal-root')!,
					)}

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

	private onExecuteIntercepted = this.props.interceptsStore!.execute.bind(this.props.interceptsStore!);

	private onLocalResponseIntercepted = this.props.interceptsStore!.localResponse.bind(this.props.interceptsStore!);

	private onAbortIntercepted = this.props.interceptsStore!.abort.bind(this.props.interceptsStore!);
}
