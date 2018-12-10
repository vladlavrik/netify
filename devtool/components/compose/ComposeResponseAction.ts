import {LitElement, html, customElement} from '@polymer/lit-element'
import '../@common/TextField'
import './ComposeActionRow.ts'
import './ComposeHeadersEditor.ts'
import './ComposeBodyEditor.ts'
declare global {
	interface HTMLElementTagNameMap {
		'compose-response-action': ComposeResponseAction;
	}
}

@customElement('compose-response-action' as any)
export class ComposeResponseAction extends LitElement {
	protected render() {
		return html`
		<style>
			:host {
				display: block;
			}
			#response-point {
				display: flex;
			}
			.response-point-item {
				margin-right: 16px;
			}
			#status-code {
				width: 168px;
			}
		</style>
		<compose-action-row title="Response point:">
			<radio-group id="response-point">
				<radio-button class="response-point-item" value="remotely" selected>Pass to server</radio-button>
				<radio-button class="response-point-item" value="locally">Response locally</radio-button>
			</radio-group>
		</compose-action-row>
		<compose-action-row title="Status code:">
			<text-field id="status-code" placeholder="Default - from server or 200" maxlength="3"></text-field>
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
