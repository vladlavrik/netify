import {LitElement, html, customElement, property} from '@polymer/lit-element'
import {classMap} from "lit-html/directives/class-map";

declare global {
	interface HTMLElementTagNameMap {
		'radio-button': RadioButton;
	}
}

export type radioValue = string | number;

@customElement('radio-button' as any)
export class RadioButton extends LitElement {

	@property({type: Boolean})
	selected?: boolean;

	@property({attribute: true, reflect: true})
	value!: radioValue;

	protected createRenderRoot() {
		// workaround to provide the "delegatesFocus" property pass
		return this.attachShadow({mode: 'open', delegatesFocus: true});
	}

	render() {
		return html`
		<style>
			:host {
				all: initial;
				display: flex;
				height: 20px;
				align-items: center;
				font-size: 12px;
				font-family: inherit;
				color: #A5A5A5;
				cursor: pointer;
			}
			#indicator {
				flex-shrink: 0;
				width: 10px;
				height: 10px;
				margin: 1px 0;
				border-radius: 6px;
				border: #A5A5A5 1px solid;
			}
			#indicator:focus {
				outline: none;
				box-shadow: 0 0 1px 2px #cc7f1c;
			}
			#indicator::before {
				content: '';
				display: block;
				margin: 3px;
				flex-shrink: 0;
				width: 4px;
				height: 4px;
				border-radius: 5px;
				background: #A5A5A5;
				opacity: 0;
				transition: opacity .1s ease-out;
			}
			#indicator.selected::before {
				opacity: 1;
			}
			#label {
				margin-left: 8px;
				padding-right: 8px;
				line-height: 14px;
				user-select: none;
			}
		</style>
		<div
			id="indicator"
			class="${classMap({
				selected: !!this.selected,
			})}"
			tabindex="0">
		</div>
		<div id="label">
			<slot></slot>
		</div>
		`;
	}

	constructor(){
		super();
		this.addEventListener('click', this.dispatchSelect);
		this.addEventListener('keydown', this.handleKey);
	}

	public connectedCallback() {
		super.connectedCallback();
		if (this.selected) {
			this.dispatchSelect();
		}
	}

	protected dispatchSelect = () => {
		this.selected = true;
		this.dispatchEvent(new Event('radioButtonSelected', {bubbles: true}));
	};

	private handleKey = (event: KeyboardEvent) => {
		switch (event.code) {
			case 'Enter':
			case 'Space':
				event.preventDefault();
				this.dispatchSelect();
				break;

			case 'ArrowUp':
			case 'ArrowLeft':
				event.preventDefault();
				this.dispatchEvent(new Event('radioButtonRequireFocusPrev', {bubbles: true}));
				break;

			case 'ArrowRight':
			case 'ArrowDown':
				event.preventDefault();
				this.dispatchEvent(new Event('radioButtonRequireFocusNext', {bubbles: true}));
				break;
		}
	};
}
