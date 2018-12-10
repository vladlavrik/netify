import {LitElement, html, customElement} from '@polymer/lit-element'
import '../@common/TextField'
import './ComposeActionRow.ts'
import './ComposeHeadersEditor.ts'
import './ComposeBodyEditor.ts'

declare global {
	interface HTMLElementTagNameMap {
		'compose-request-action': ComposeRequestAction;
	}
}

@customElement('compose-request-action' as any)
export class ComposeRequestAction extends LitElement {
	protected render() {
		return html`
		<style>
			:host {
				display: block;
			}
			#endpoint {
				display: block;
				width: 100%;
			}
		</style>
		<compose-action-row title="Replace endpoint:">
			<text-field id="endpoint" placeholder="%protocol%//%hostname%:%port%%path%%query%">
		</compose-action-row>
		<compose-action-row title="Headers:">
			<compose-headers-editor></compose-headers-editor>
		</compose-action-row>
		<compose-action-row title="Body:">
			<compose-body-editor></compose-body-editor>
		</compose-action-row>
		`;
	}
}
