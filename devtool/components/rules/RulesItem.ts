import {LitElement, html, customElement, property} from '@polymer/lit-element'
import {Rule} from "../../debugger/constants/Rule";
import state from "../../helpers/decorators/state";
import '../@common/IconButton'

declare global {
	interface HTMLElementTagNameMap {
		'rules-item': RulesItem;
	}
}

@customElement('rules-item' as any)
export class RulesItem extends LitElement {
	@property()
	rule!: Rule;

	@state()
	expanded = false;

	protected render() {
		const {methods, requestTypes, url} = this.rule.filter;
		const actions = this.parseActionsArray().join(', ');

		return html`
		<style>
			:host {
				all: inherit;
				display: block;
				font-family: inherit;
				font-size: 12px;
				min-height: 48px;
			}
			#entry {
				display: flex;
				align-items: center;
				color: #B1B9C0;
			}
			#expand-button {
				flex-shrink: 0;
				margin: 0 3px;
				--icon-button-bg: #616161;
				--icon-button-clip: polygon(30% 34%, 70% 34%, 50% 66%);
			}
			#summary {
				flex-grow: 1;
				overflow: hidden;
			}
			#filter-info {
				display: flex;
				margin-top: 8px;
			}
			#method, #type {
				width: 120px;
				min-width: 100px;
			}
			#url {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			#actions-info {
				margin: 4px 0 8px 0;
				color: #7E7E7E;
			}
			#remove-button {
				flex-shrink: 0;
				margin: 0 6px 0 12px;
				--icon-button-bg: url("/devtool/styles/icons/remove.svg");
				cursor: pointer;
			}
			.placeholder {
				color: #616161;
			}
		</style>
		<div id="entry">
			<icon-button
				id="expand-button"
				@click="${this.handleExpand}">
			</icon-button>
			<div id="summary">
				<div id="filter-info">
					<span class="value" id="method">
						${methods.length === 0 ? (
							html`<span class="placeholder">All methods</span>`
						) : (
							methods.join('/')
						)}
					</span>
					<span class="value" id="type">
						${requestTypes.length === 0 ? (
							html`<span class="placeholder">All types</span>`
						) : (
							requestTypes.join('/')
						)}
					</span>
					<span class="value" id="url" title="">
						${url.value ? (
							url.value.toString()
						) : (
							html`<span class="placeholder">Any url</span>`
						)}
					</span>
				</div>
				<p id="actions-info">${actions}</p>
			</div>
			<icon-button
				id="remove-button"
				tooltip="Remove the rule"
				@click="${this.handleRemove}">
			</icon-button>
		</div>
		${this.expanded ? (
			html`
			<div id="details">
				<slot></slot>
			</div>
			`
		) : ''}
		`;
	}

	private parseActionsArray() {
		const actions = [];

		if (this.rule.mutateRequest.enabled) {
			const {endpointReplace, headersToAdd, headersToRemove, replaceBody} = this.rule.mutateRequest;
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

		if (this.rule.mutateRequest.enabled) {
			const {statusCode, headersToAdd, headersToRemove, replaceBody} = this.rule.mutateResponse;
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
		if (this.rule.responseError.enabled) {
			actions.push('Return error');
		}

		return actions;
	}

	private handleExpand = () => {
		this.expanded = !this.expanded;
	};

	private handleRemove() {
		this.dispatchEvent(new CustomEvent('requireRuleRemove', {
			bubbles: true,
			composed: true,
			detail: {
				id: this.rule.id,
			},
		}));
	}
}
