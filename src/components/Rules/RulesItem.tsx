import * as React from 'react';
import classNames from 'classnames';
import {Rule} from '@/interfaces/Rule';
import {IconButton} from '@/components/@common/IconButton';
import {PopUpConfirm} from '@/components/@common/PopUpConfirm';
import {RequestBodyType} from '@/constants/RequestBodyType';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
import styles from './rulesItem.css';

interface Props {
	data: Rule;
	onRemove: (id: string) => void;
}

interface State {
	expanded: boolean;
	removeConfirmShow: boolean;
}

export class RulesItem extends React.PureComponent<Props, State> {
	state = {
		expanded: false,
		removeConfirmShow: false,
	};

	render() {
		const {filter} = this.props.data;
		const {expanded, removeConfirmShow} = this.state;
		const {methods, resourceTypes} = filter;
		const url = filter.url.value ? filter.url.value.toString() : undefined;

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
								{!url ? ( // prettier-ignore
									<span className={styles.placeholder}>All urls</span>
								) : (
									url.toString()
								)}
							</span>
						</div>
						<p className={styles.actionsInfo}>{this.parseActionsArray()}</p>
					</div>

					<IconButton className={styles.removeButton} tooltip='Remove the rule' onClick={this.onRemoveInit} />
				</div>

				{expanded && <div>{this.props.children}</div>}

				{removeConfirmShow && (
					<PopUpConfirm onConfirm={this.onRemoveConfirm} onCancel={this.onRemoveCancel}>
						Remove the rule forever?
					</PopUpConfirm>
				)}
			</div>
		);
	}

	private parseActionsArray() {
		const {mutateRequest, mutateResponse, cancelRequest} = this.props.data.actions;
		const actions = [];

		if (mutateRequest.enabled) {
			const {endpointReplace, methodReplace, headers, bodyReplace} = mutateRequest;
			if (endpointReplace) {
				actions.push('Redirect to url');
			}
			if (methodReplace) {
				actions.push('Replacing method');
			}
			if (Object.keys(headers.add).length > 0 || headers.remove.length > 0) {
				actions.push('Modifying request headers');
			}
			if (bodyReplace.type !== RequestBodyType.Original) {
				actions.push('Replacing request body');
			}
		}

		if (mutateResponse.enabled) {
			const {statusCode, headers, bodyReplace} = mutateResponse;
			if (statusCode) {
				actions.push('Replacing response status');
			}
			if (Object.keys(headers.add).length > 0 || headers.remove.length > 0) {
				actions.push('Modifying response headers');
			}
			if (bodyReplace.textValue !== ResponseBodyType.Original) {
				actions.push('Replacing response body');
			}
		}

		if (cancelRequest.enabled) {
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

	private onRemoveInit = () => {
		this.setState({removeConfirmShow: true});
	};

	private onRemoveCancel = () => {
		this.setState({removeConfirmShow: false});
	};

	private onRemoveConfirm = () => {
		this.props.onRemove(this.props.data.id);
	};
}
