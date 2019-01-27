import * as React from 'react';
import {reaction} from 'mobx';
import {observer, inject} from 'mobx-react';
import * as classNames from 'classnames';
import {RulesStore} from '@/stores/RulesStore';
import {AppStore} from '@/stores/AppStore';
import {RulesItem} from './RulesItem';
import {RulesDetails} from './RulesDetails';
import {Button} from '@/components/@common/Button';
import styles from './rules.css';

interface Props {
	rulesStore?: RulesStore;
	appStore?: AppStore;
}

@inject('rulesStore')
@inject('appStore')
@observer
export class Rules extends React.Component<Props> {
	private highlightedItemRef = React.createRef<HTMLLIElement>();
	private shouldScrollToHighlighted = false;

	render() {
		const {list, highlightedId} = this.props.rulesStore!;

		if (list.length === 0) {
			return (
				<div className={styles.root}>
					<p className={styles.placeholder}>
						No rules yet
						<Button className={styles.composeButton} onClick={this.onShowCompose}>
							Compose a first rule
						</Button>
					</p>
				</div>
			);
		}

		return (
			<div className={styles.root}>
				<ul className={styles.list}>
					{list.map(item => (
						<li
							key={item.id}
							ref={item.id === highlightedId ? this.highlightedItemRef : null}
							className={classNames(styles.item, item.id === highlightedId && styles.highlighted)}
							onAnimationEnd={this.onFinishHighlighting}>
							<RulesItem data={item} onRemove={this.onRemove}>
								<RulesDetails data={item} />
							</RulesItem>
						</li>
					))}
				</ul>
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

	onFinishHighlighting = () => this.props.rulesStore!.setHighlighted(null);

	onShowCompose = () => this.props.appStore!.toggleComposeShow();

	onRemove = (id: string) => this.props.rulesStore!.removeById(id); //TODO ask confirmation
}
