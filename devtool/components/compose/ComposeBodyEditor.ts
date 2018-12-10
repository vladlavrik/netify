import {LitElement, html, customElement} from '@polymer/lit-element'
import '../@common/RadioGroup'
import '../@common/RadioButton'
import '../@common/TextAreaField'

declare global {
	interface HTMLElementTagNameMap {
		'compose-body-editor': ComposeBodyEditor;
	}
}

@customElement('compose-body-editor' as any)
export class ComposeBodyEditor extends LitElement {
	protected render() {
		return html`
			<style>
				:host {
					display: block;
				}
				#type {
					display: flex;
					margin-bottom: 8px;
				}
				.type-item {
					margin-right: 20px;
				}
				#content {
					width: 100%;
				}
			</style>
			<radio-group id="type">
				<radio-button class="type-item" value="Text" selected>Text</radio-button>
				<!--<radio-button class="type-item" value="JSON">JSON</radio-button>-->
				<radio-button class="type-item" value="Base64">Base64</radio-button>
				<!--<radio-button class="type-item" value="File">File</radio-button>-->
			</radio-group>
			<text-area-field id="content" placeholder="Body content"></text-area-field>
		`;
	}
}
