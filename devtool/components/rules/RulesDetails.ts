import {LitElement, html, customElement, property} from '@polymer/lit-element'
import {Rule} from "../../debugger/constants/Rule";

declare global {
	interface HTMLElementTagNameMap {
		'rules-details': RulesDetails;
	}
}

@customElement('rules-details' as any)
export class RulesDetails extends LitElement {
	@property()
	rule!: Rule;
	
	protected render() {
		const {filter, mutateRequest, mutateResponse, responseError} = this.rule;
		
		return html`
		<style>
			:host {
				all: inherit;
				display: block;
				align-items: center;
				font-family: inherit;
				font-size: 12px;
				background: #383838;
			}
			.data-title {
				color: #717171;
				padding: 4px 16px 4px 24px;
				vertical-align: top;
			}
			.data-value {
				color: #B1B9C0;
				padding: 4px 0;
			}
			.separator {
				height: 1px;
				background: #555555;
				margin: 8px 0;
			}
			.separator_top {
				margin-top: 0;
			}
		</style>

		<div class="separator separator_top"></div>

		<table>
		${filter.url.value ? html`
			 <tr>
				<td class="data-title">Url:</td>
				<td class="data-value">${this.rule.filter.url.value.toString()}</td>
			</tr>
		` : ''}

		${filter.methods.length > 0 ? html`
			<tr>
				<td class="data-title">Methods:</td>
				<td class="data-value">${this.rule.filter.methods.join(', ') || 'All methods'}</td>
			</tr>
		` : ''}

		${filter.requestTypes.length > 0 ? html`
			<tr>
				<td class="data-title">Request types:</td>
				<td class="data-value">${this.rule.filter.requestTypes.join(', ') || 'All types'}</td>
			</tr>
		` : ''}
		</table>

		<div class="separator"></div>

		<table>
			${mutateRequest.endpointReplace ? html`
				<tr>
					<td class="data-title">Request endpoint:</td>
					<td class="data-value">${mutateRequest.endpointReplace}</td>
				</tr>
			`: ''}
		
			${Object.keys(mutateRequest.headersToAdd).length > 0 ? html`
				<tr>
					<td class="data-title">Added request headers:</td>
					<td class="data-value">
						${Object.entries(mutateRequest.headersToAdd).map(([key, value]) => (
							key + ': ' + value
						)).join('<br>')}
					</td>
				</tr>
			`: ''}
		
			${mutateRequest.headersToRemove.length > 0 ? html`
				<tr>
					<td class="data-title">Removed request headers:</td>
					<td class="data-value">
						${mutateRequest.headersToRemove.join('<br>')}
					</td>
				</tr>
			`: ''}
		
			${mutateRequest.replaceBody.enabled ? html`
				<tr>
					<td class="data-title">Replaced request body</td>
					<td class="data-value">${mutateRequest.replaceBody.value}</td>
				</tr>
			`: ''}
		</table>

		<div class="separator"></div>

		<table>
			${mutateResponse.statusCode ? html`
				<tr>
					<td class="data-title">Response status</td>
					<td class="data-value">${mutateResponse.statusCode.toString()}</td>
				</tr>
			` : ''}

			${Object.keys(mutateResponse.headersToAdd).length > 0 ? html`
				<tr>
					<td class="data-title">Added response headers:</td>
					<td class="data-value">
						${Object.entries(mutateResponse.headersToAdd).map(([key, value]) => (
							key + ': ' + value
						)).join('<br>')}
					</td>
				</tr>
			` : ''}

			${mutateResponse.headersToRemove.length > 0 ? html`
				<tr>
					<td class="data-title">Removed response headers:</td>
					<td class="data-value">
						${mutateResponse.headersToRemove.join('<br>')}
					</td>
				</tr>
			` : ''}

			${mutateResponse.replaceBody.enabled ? html`
				<tr>
					<td class="data-title">Replaced response body</td>
					<td class="data-value">${mutateRequest.replaceBody.value}</td>
				</tr>
			` : ''}
		</table>

		<div class="separator"></div>

		<table>
		  ${responseError.enabled ? html`
			 <tr>
				<td class="data-title">Response error:</td>
				<td class="data-value">${responseError.reason.toString()}</td>
			</tr>
		  ` : ''}
		</table>
		`;
	}
}
