import * as React from 'react';
import classNames from 'classnames';
import {Rule} from '@/debugger/constants/Rule';
import {IconButton} from '@/components/@common/IconButton';
import styles from './rulesItem.css';


interface Props {
	data: Rule
}

interface State {
	expanded: boolean
}

export class RulesItem extends React.Component<Props, State> {

	state = {
		expanded: false,
	};

	render() {
		const {filter} = this.props.data;

		return (
			<div className={styles.root}>
				<div className={styles.entry}>
					<IconButton
						className={styles.expandButton}
						onClick={this.onExpand}/>

					<div className={styles.summary}>
						<div className={styles.filterInfo}>
							<span className={classNames(styles.value, styles.method)}>
								{filter.methods.length === 0 ? (
									<span className={styles.placeholder}>All methods</span>
								) : (
									filter.methods.join('/')
								)}
							</span>
							<span className={classNames(styles.value, styles.type)}>
								{filter.requestTypes.length === 0 ? (
									<span className={styles.placeholder}>All types</span>
								) : (
									filter.requestTypes.join('/')
								)}
							</span>
							<span className={classNames(styles.value, styles.url)} title="">
								{!filter.url.value ? (
									<span className={styles.placeholder}>All urls</span>
								) : (
									filter.url.value.toString()
								)}
							</span>
						</div>
						<p className={styles.actionsInfo}>{this.parseActionsArray()}</p>
					</div>
					<IconButton
						className={styles.removeButton}
						tooltip="Remove the rule"
						onClick={this.onRemove}>
					</IconButton>
				</div>

				{this.state.expanded && (
					<div>
						{this.props.children}
					</div>
				)}
			</div>
		);
	}

	private parseActionsArray() {
		const {mutateRequest, mutateResponse, responseError} = this.props.data;
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
		if (responseError.enabled) {
			actions.push('Return error');
		}

		return actions;
	}


	private onExpand = () => {
		console.log('onExpand');
	};

	private onRemove = () => {
		console.log('onRemove');
	};
}
