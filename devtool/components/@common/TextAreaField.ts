import {LitElement, html, customElement, property} from '@polymer/lit-element'


@customElement('text-area-field' as any)
export class TextAreaField extends LitElement {

	@property({attribute: true, reflect: true})
	placeholder?: string;

	@property({attribute: true, reflect: true})
	maxlength?: string;

	@property({attribute: true, reflect: true})
	disabled?: boolean;

	protected createRenderRoot() {
		// workaround to provide the "delegatesFocus" property pass
		return this.attachShadow({mode: 'open', delegatesFocus: true});
	}

	render() {
		return html`
		<style>
			:host {
				all: initial;
				display: block;
				padding: 0;
				font-family: inherit;
				color: #A5A5A5;
				background: #242424;
			}
			#input {
				display: block;
				padding: 3px 8px;
				width: 100%;
				min-height: 62px;
				max-height: 300px;
				box-sizing: border-box;
				line-height: 14px;
				border: transparent 1px solid;
				background: transparent;
				color: inherit;
				font-family: inherit;
				font-size: 11px;
				resize: vertical;
			}
			:host(:focus) {
				border-color: #356A9E;
			}
			#input:focus {
				outline: none;
			}
			#input[disabled] {
				border-color: transparent;
				background: #292929;
				color: #CFCFCF;
			}
		</style>
		<textarea
			id="input"
			spellcheck="false"
			placeholder="${this.placeholder}"
			maxlength="${this.maxlength}"
			?disabled="${this.disabled}"></textarea>
		`;
	}
}
