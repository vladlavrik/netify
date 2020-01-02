import * as React from 'react';
import classNames from 'classnames';
import {Rule} from '@/interfaces/rule';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {IconButton} from '@/components/@common/buttons/IconButton';
import styles from './rulesItem.css';

interface Props {
	data: Rule;
	onEdit(id: string): void;
	onRemove(id: string): void;
}

interface State {
	expanded: boolean;
}

export class RulesItem extends React.PureComponent<Props, State> {
	state = {
		expanded: false,
	};

	render() {
		const {filter} = this.props.data;
		const {expanded} = this.state;
		const {url, methods, resourceTypes} = filter;

		return (
			<div className={styles.root}>
				<div className={styles.entry}>
					<IconButton
						className={classNames(styles.expandButton, expanded && styles.expanded)}
						onClick={this.onToggleExpand}
					/>

					<div className={styles.summary}>
						<div className={styles.filterInfo}>
							<span className={classNames(styles.value, styles.method)}>
								{methods.length === 0 ? (
									<span className={styles.placeholder}>All methods</span>
								) : (
									methods.join('/')
								)}
							</span>
							<span className={classNames(styles.value, styles.type)}>
								{resourceTypes.length === 0 ? (
									<span className={styles.placeholder}>All resources</span>
								) : (
									resourceTypes.join('/')
								)}
							</span>
							<span className={classNames(styles.value, styles.url)} title={url && url.toString()}>
								{!url ? ( // prettier-ignore
									<span className={styles.placeholder}>All urls</span>
								) : (
									url
								)}
							</span>
						</div>
						<p className={styles.actionsInfo}>{this.parseActionsArray()}</p>
					</div>

					<div className={styles.controlsPlaceholder} />

					<IconButton
						className={classNames(styles.control, styles.typeEdit)}
						tooltip='Edit the rule'
						onClick={this.onEdit}
					/>
					<IconButton
						className={classNames(styles.control, styles.typeRemove)}
						tooltip='Remove the rule'
						onClick={this.onRemove}
					/>
				</div>

				{expanded && <div>{this.props.children}</div>}
			</div>
		);
	}

	private parseActionsArray() {
		// TODO show is active
		const {action} = this.props.data;
		const actions = [];

		if (action.type === RuleActionsType.Breakpoint) {
			if (action.request) {
				actions.push('Breakpoint on request');
			}
			if (action.response) {
				actions.push('Breakpoint on response');
			}
		}

		if (action.type === RuleActionsType.Mutation) {
			if (action.request) {
				const {endpoint, method, setHeaders, dropHeaders, body} = action.request;
				if (endpoint) {
					actions.push('Redirect to url');
				}
				if (method) {
					actions.push('Replacing method');
				}
				if (setHeaders.length > 0 || dropHeaders.length > 0) {
					actions.push('Modifying request headers');
				}
				if (body) {
					actions.push('Replacing request body');
				}
			}
			if (action.response) {
				const {statusCode, setHeaders, dropHeaders, body} = action.response;
				if (statusCode) {
					actions.push('Replacing response status');
				}
				if (setHeaders.length > 0 || dropHeaders.length > 0) {
					actions.push('Modifying response headers');
				}
				if (body) {
					actions.push('Replacing response body');
				}
			}
		}

		if (action.type === RuleActionsType.LocalResponse) {
			actions.push('Local response');
		}

		if (action.type === RuleActionsType.Failure) {
			actions.push('Returning error');
		}

		if (actions.length === 0) {
			actions.push('No actions');
		}

		return actions.join(', ');
	}

	private onToggleExpand = () => {
		this.setState(state => ({expanded: !state.expanded}));
	};

	private onEdit = () => this.props.onEdit(this.props.data.id);

	private onRemove = () => this.props.onRemove(this.props.data.id);
}
