import * as React from 'react';
import classNames from 'classnames';
import {Rule} from '@/debugger/interfaces/Rule';
import {IconButton} from '@/components/@common/IconButton';
import styles from './rulesItem.css';

interface Props {
	data: Rule;
}

interface State {
	expanded: boolean;
}

export class RulesItem extends React.Component<Props, State> {
	state = {
		expanded: false,
	};

	render() {
		const {filter} = this.props.data;
		const {expanded} = this.state;
		const {methods, resourceTypes} = filter;
		const url = filter.url.value
			? filter.url.value.toString()
			: undefined;

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
									<span className={styles.placeholder}>All types</span>
								) : (
									resourceTypes.join('/')
								)}
							</span>
							<span className={classNames(styles.value, styles.url)} title={url && url.toString()}>
								{!url ? (
									<span className={styles.placeholder}>All urls</span>
								) : (
									url.toString()
								)}
							</span>
						</div>
						<p className={styles.actionsInfo}>{this.parseActionsArray()}</p>
					</div>
					<IconButton className={styles.removeButton} tooltip='Remove the rule' onClick={this.onRemove} />
				</div>

				{expanded && <div>{this.props.children}</div>}
			</div>
		);
	}

	private parseActionsArray() {
		const {mutateRequest, mutateResponse, cancelRequest} = this.props.data.actions;
		const actions = [];

		if (mutateRequest.enabled) {
			const {endpointReplace, headersToAdd, headersToRemove, replaceBody} = mutateRequest;
			if (endpointReplace) {
				actions.push('Redirect to url');
			}
			if (Object.keys(headersToAdd).length > 0 || headersToRemove.length > 0) {
				actions.push('Modify request headers');
			}
			if (replaceBody.enabled) {
				actions.push('Defined request body');
			}
		}

		if (mutateRequest.enabled) {
			const {statusCode, headersToAdd, headersToRemove, replaceBody} = mutateResponse;
			if (statusCode) {
				actions.push('Modify response status');
			}
			if (Object.keys(headersToAdd).length > 0 || headersToRemove.length > 0) {
				actions.push('Modify request headers');
			}
			if (replaceBody.enabled) {
				actions.push('Defined request body');
			}
		}
		if (cancelRequest.enabled) {
			actions.push('Return error');
		}

		return actions;
	}

	private onToggleExpand = () => {
		this.setState(state => ({expanded: !state.expanded}));
	};

	private onRemove = () => {
		console.log('onRemove');
	};
}
