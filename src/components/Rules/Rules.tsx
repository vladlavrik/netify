import * as React from 'react';
import {reaction} from 'mobx';
import {observer, inject} from 'mobx-react';
import classNames from 'classnames';
import {RulesStore} from '@/stores/RulesStore';
import {AppStore} from '@/stores/AppStore';
import {SectionHeader} from '@/components/@common/misc/SectionHeader';
import {Button} from '@/components/@common/buttons/Button';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {PopUpConfirm} from '@/components/@common/popups/PopUpConfirm';
import {RulesItem} from './RulesItem';
import {RulesDetails} from './RulesDetails';
import styles from './rules.css';

interface Props {
	appStore?: AppStore;
	rulesStore?: RulesStore;
}

@inject('appStore', 'rulesStore')
@observer
export class Rules extends React.Component<Props> {
	private readonly highlightedItemRef = React.createRef<HTMLLIElement>();
	private shouldScrollToHighlighted = false;

	render() {
		const {debuggerAllowed} = this.props.appStore!;
		const {list, highlightedId, listIsEmpty, removeConfirmationId, clearAllConfirmation} = this.props.rulesStore!;

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
							listIsEmpty || !debuggerAllowed ? styles.typeStartListen : styles.typeStopListen,
						)}
						disabled={listIsEmpty}
						tooltip={debuggerAllowed ? 'Disable debugger' : 'Enable debugger'}
						onClick={this.toggleDebuggerAllowed}
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

	componentDidMount() {
		reaction(
			// TODO unset listener
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

	private toggleDebuggerAllowed = () => this.props.appStore!.toggleDebuggerAllowed();

	private onFinishHighlighting = () => this.props.rulesStore!.setHighlighted(null);

	private onShowCompose = () => this.props.appStore!.showCompose();

	private onItemEdit = (id: string) => this.props.appStore!.showRuleEditor(id);

	private onRemoveAsk = (id: string) => this.props.rulesStore!.askToRemoveItem(id);

	private onRemoveCancel = () => this.props.rulesStore!.cancelRemove();

	private onRemoveConfirm = () => this.props.rulesStore!.confirmRemove();

	private onClearAllAsk = () => this.props.rulesStore!.askToClearAll();

	private onClearAllCancel = () => this.props.rulesStore!.cancelClearAll();

	private onClearAllConfirm = () => this.props.rulesStore!.confirmClearAll();
}
