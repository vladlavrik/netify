import * as React from 'react';
import {observer, inject} from 'mobx-react';
import {RulesStore} from './RulesStore';
import {RulesItem} from './RulesItem';
import {RulesDetails} from './RulesDetails';
import styles from './rules.css';
import {Button} from '@/components/@common/Button';
import {AppStore} from '@/components/App';

interface Props {
	rulesStore?: RulesStore;
	appStore?: AppStore;
}

@inject('rulesStore')
@inject('appStore')
@observer
export class Rules extends React.Component<Props> {
	render() {
		const {list} = this.props.rulesStore!;

		if (list.length === 0) {
			return (
				<div className={styles.root}>
					<p className={styles.placeholder}>
						No rules yet
						<Button
							className={styles.composeButton}
							onClick={this.onShowCompose}>Compose a first rule</Button>
					</p>
				</div>
			);
		}

		return (
			<div className={styles.root}>
				<ul className={styles.list}>
					{list.map(item => (
						<li className={styles.item} key={item.id}>
							<RulesItem data={item}>
								<RulesDetails data={item} />
							</RulesItem>
						</li>
					))}
				</ul>
			</div>
		);
	}

	onShowCompose = () => this.props.appStore!.toggleComposeShow();
}
