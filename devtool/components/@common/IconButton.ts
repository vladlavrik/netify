import {LitElement, html, customElement, property} from '@polymer/lit-element';
import './WithTooltip';

declare global {
	interface HTMLElementTagNameMap {
		'icon-button': IconButton;
	}
}

@customElement('icon-button' as any)
export class IconButton extends LitElement {

	@property({attribute: true, reflect: true})
	tooltip?: string;

	@property({attribute: true, reflect: true})
	disabled?: boolean;

	protected createRenderRoot() {
		return this.attachShadow({mode: 'open', delegatesFocus: true});
	}

	protected render() {
		return html`
		<style>
			:host {
				all: initial;
				display: block;
				width: 18px;
				height: 18px;
				font-family: inherit;
			}
			:host(:focus) {
				outline: none;
				width: 18px;
				height: 18px;
			}
			#button {
				display: block;
				width: 100%;
				height: 100%;
				border: none;
				padding: 0;
				background: none;
			}
			#button::before {
				content: '';
				display: block;
				width: 100%;
				height: 100%;
				opacity: 0.75;
				background: var(--icon-button-bg, none) center no-repeat;
				transform: rotate(var(--icon-button-rotate, 0));
				transition: transform .1s ease-out;
				clip-path: var(--icon-button-clip, none);
			}
			#button:hover::before {
				opacity: 1;
			}
			:host(:focus) #button {
				outline: #356A9E solid 1px;
			}
			#button[disabled]::before {
				opacity: 0.5;
				outline: none;
			}
			#tooltip {
				white-space: nowrap;
			}
		</style>
		<with-tooltip ?disabled="${this.disabled}">
			<button id="button" type="button" ?disabled="${this.disabled}"></button>
			<span id="tooltip" slot="tooltip">${this.tooltip}</span>
		</with-tooltip>
		`;
	}
}
