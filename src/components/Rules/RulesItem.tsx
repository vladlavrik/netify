import * as React from 'react';
import classNames from 'classnames';
import {Rule} from '@/interfaces/Rule';
import {IconButton} from '@/components/@common/IconButton';
import {RequestBodyType} from '@/constants/RequestBodyType';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
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
		const {intercept} = this.props.data;
		const {mutateRequest, mutateResponse, cancelRequest} = this.props.data.actions;
		const actions = [];

		if (intercept.request) {
			actions.push('Intercept on request');
		}

		if (intercept.response) {
			actions.push('Intercept on response');
		}

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
			if (bodyReplace.type !== ResponseBodyType.Original) {
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

	private onEdit = () => this.props.onEdit(this.props.data.id);

	private onRemove = () => this.props.onRemove(this.props.data.id);
}
