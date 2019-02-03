import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {reaction} from 'mobx';
import {observer, inject} from 'mobx-react';
import * as classNames from 'classnames';
import {RulesStore} from '@/stores/RulesStore';
import {Rule} from '@/interfaces/Rule';
import {SectionHeader} from '@/components/@common/SectionHeader';
import {Button} from '@/components/@common/Button';
import {IconButton} from '@/components/@common/IconButton';
import {PopUpConfirm} from '@/components/@common/PopUpConfirm';
import {Editor} from '@/components/Editor';
import {RulesItem} from './RulesItem';
import {RulesDetails} from './RulesDetails';
import styles from './rules.css';

interface Props {
	rulesStore?: RulesStore;
}

@inject('rulesStore')
@observer
export class Rules extends React.Component<Props> {
	private readonly highlightedItemRef = React.createRef<HTMLLIElement>();
	private readonly composeModalTarget = document.getElementById('modal-root')!;
	private shouldScrollToHighlighted = false;

	render() {
		const {
			list,
			highlightedId,
			debuggerDisabled,
			listIsEmpty,
			composeShown,
			editingItem,
			removeConfirmationId,
			clearAllConfirmation,
		} = this.props.rulesStore!;

		return (
			<div className={styles.root}>
				<SectionHeader title='Rules'>
					<IconButton
						className={classNames(styles.control, styles.typeAdd)}
						tooltip='Add a new rule'
						onClick={this.onShowCompose}
					/>
					<IconButton
						className={classNames(
							styles.control,
							listIsEmpty || debuggerDisabled ? styles.typeStartListen : styles.typeStopListen,
						)}
						disabled={listIsEmpty}
						tooltip={debuggerDisabled ? 'Enable debugger' : 'Disable debugger'}
						onClick={this.onToggleDebuggerEnabled}
					/>
					<IconButton
						className={classNames(styles.control, styles.typeClear)}
						disabled={listIsEmpty}
						tooltip='Clear all rules'
						onClick={this.onClearAllAsk}
					/>
				</SectionHeader>

				<div className={styles.content}>
					{list.length === 0 ? (
						<p className={styles.placeholder}>
							No rules yet
							<Button className={styles.composeButton} onClick={this.onShowCompose}>
								Compose a first rule
							</Button>
						</p>
					) : (
						<ul className={styles.list}>
							{list.map(item => (
								<li
									key={item.id}
									ref={item.id === highlightedId ? this.highlightedItemRef : null}
									className={classNames(styles.item, item.id === highlightedId && styles.highlighted)}
									onAnimationEnd={this.onFinishHighlighting}>
									<RulesItem data={item} onRemove={this.onRemoveAsk} onEdit={this.onItemEdit}>
										<RulesDetails data={item} />
									</RulesItem>
								</li>
							))}
						</ul>
					)}
				</div>

				{composeShown &&
					ReactDOM.createPortal(
						<Editor onSave={this.onSaveComposed} onCancel={this.onHideCompose} />,
						this.composeModalTarget,
					)}

				{editingItem &&
					ReactDOM.createPortal(
						<Editor
							initialValues={editingItem}
							onSave={this.onSaveEdited}
							onCancel={this.onCancelItemEdit}
						/>,
						this.composeModalTarget,
					)}

				{removeConfirmationId && (
					<PopUpConfirm onConfirm={this.onRemoveConfirm} onCancel={this.onRemoveCancel}>
						Remove the rule forever?
					</PopUpConfirm>
				)}

				{clearAllConfirmation && (
					<PopUpConfirm onConfirm={this.onClearAllConfirm} onCancel={this.onClearAllCancel}>
						Clear all rules forever?
					</PopUpConfirm>
				)}
			</div>
		);
	}

	componentWillMount() {
		reaction(
			() => this.props.rulesStore!.highlightedId,
			(highlightedId: string | null) => {
				if (highlightedId) {
					this.shouldScrollToHighlighted = true;
				}
			},
		);
	}

	componentDidUpdate() {
		if (this.shouldScrollToHighlighted && this.highlightedItemRef.current) {
			this.highlightedItemRef.current!.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});

			this.shouldScrollToHighlighted = false;
		}
	}

	private onToggleDebuggerEnabled = () => this.props.rulesStore!.toggleDebuggerDisabled();

	private onFinishHighlighting = () => this.props.rulesStore!.setHighlighted(null);

	private onShowCompose = () => this.props.rulesStore!.showCompose();

	private onHideCompose = () => this.props.rulesStore!.hideCompose();

	private onSaveComposed = (rule: Rule) => this.props.rulesStore!.create(rule);

	private onItemEdit = (id: string) => this.props.rulesStore!.showItemEditor(id);

	private onSaveEdited = (rule: Rule) => this.props.rulesStore!.save(rule);

	private onCancelItemEdit = () => this.props.rulesStore!.hideItemEditor();

	private onRemoveAsk = (id: string) => this.props.rulesStore!.askToRemoveItem(id);

	private onRemoveCancel = () => this.props.rulesStore!.cancelRemove();

	private onRemoveConfirm = () => this.props.rulesStore!.confirmRemove();

	private onClearAllAsk = () => this.props.rulesStore!.askToClearAll();

	private onClearAllCancel = () => this.props.rulesStore!.cancelClearAll();

	private onClearAllConfirm = () => this.props.rulesStore!.confirmClearAll();
}
