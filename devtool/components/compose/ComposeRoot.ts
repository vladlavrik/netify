import {LitElement, html, customElement, property} from '@polymer/lit-element'
import '../@common/ExpandableCheckbox'
import './ComposeFilter.ts'
import './ComposeRequestAction.ts'
import './ComposeResponseAction.ts'
import './ComposeCancelAction.ts'

declare global {
	interface HTMLElementTagNameMap {
		'compose-root': ComposeRoot;
	}
}

@customElement('compose-root' as any)
export class ComposeRoot extends LitElement {
	@property({attribute: true, reflect: true})
	disabled?: boolean;

	protected render() {
		return html`
		<style>
			:host {
				all: initial;
				display: block;
				height: 100%;
				overflow: auto;
				font-family: inherit;
			}
			#root {
				min-width: 500px;
				padding: 0 8px 16px 8px;
			}
			.title {
				font-size: 12px;
				margin: 16px 0 4px 0;
				color: #A5A5A5;
			}
			.controls {
				display: flex;
				margin-top: 16px;
			}
			#save {
				background: #242424;
				font-family: inherit;
				height: 24px;
				border-radius: 3px;
				border: #555555 1px solid;
				padding: 0 16px;
				color: #A5A5A5;
			}
			#save, #cancel {
				height: 24px;
				padding: 0 16px;
				border-radius: 3px;
				border: #555555 1px solid;
				font-family: inherit;
				cursor: pointer;
			}
			#save:focus, #cancel:focus {
				outline: none;
				border-color: #356A9E;
			}
			#save {
				background: #242424;
				color: #A5A5A5;
			}
			#cancel {
				margin-left: 8px;
				background: #313131;
				color: #A5A5A5;
			}
		</style>
		<div id="root">
			<h3 class="title">Filter requests:</h3>
			<compose-filter></compose-filter>
			
			<h3 class="title">Actions:</h3>
			<expandable-checkbox label="Mutate request">
				<compose-request-action></compose-request-action>
			</expandable-checkbox>

			<expandable-checkbox label="Mutate Response">
				<compose-response-action></compose-response-action>
			</expandable-checkbox>

			<expandable-checkbox label="Cancel">
				<compose-cancel-action></compose-cancel-action>
			</expandable-checkbox>
			
			<div class="controls">
				<button id="save" @click="${this.onSave}">Save</button>
				<button id="cancel" @click="${this.onCancel}">Cancel</button>
			</div>
		</div>
		`;
	}

	private onSave = () => {
		this.dispatchEvent(new CustomEvent('requireComposeSave', {
			bubbles: true,
			detail: {
				rule: this.shadowRoot!.querySelector('compose-filter')!.getValue()
			}
		}));
	};

	private onCancel() {
		this.dispatchEvent(new Event('requireComposeHide', {bubbles: true, composed: true}));
	};
}
