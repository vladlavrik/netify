import {LitElement, html, customElement, property} from '@polymer/lit-element'
import {classMap} from 'lit-html/directives/class-map'

declare global {
	interface HTMLElementTagNameMap {
		'select-option': SelectOption;
	}
}

export type optionValue = string | number;

@customElement('select-option' as any)
export class SelectOption extends LitElement {

	@property({type: Boolean})
	highlighted?: boolean;

	@property({type: Boolean})
	selected?: boolean;

	@property({attribute: true, reflect: true})
	value!: optionValue;

	/*
	 * TODO
	 * notify about connect to DOM to SelectDropdown update options list
	 **/

	constructor() {
		super();
		this.addEventListener('click', this.handleSelectByClick)
	}

	render() {
		return html`
		<style>
			:host {
				all: initial;
				display: block;
				font-size: 12px;
				line-height: 20px;
				font-family: inherit;
				color: #A5A5A5;
				cursor: pointer;
			}
			#wrapper {
				padding: 0 8px;
			}
			#wrapper.selected {
				background: #424242;
			}
			#wrapper:hover,
			#wrapper.highlighted {
				background: #356A9E;
			}
		</style>
		<div
			id="wrapper"
			class="${classMap({
				highlighted: !!this.highlighted,
				selected: !!this.selected,
			})}">
			<slot></slot>
		</div>
		`;
	}

	public connectedCallback() {
		super.connectedCallback();
		if (this.selected) {
			this.dispatchSelect(true);
		}
	}

	private handleSelectByClick = (event: MouseEvent) =>  {
		const allowMultiCheck = event.metaKey || event.shiftKey;
		this.dispatchSelect(allowMultiCheck);
	};

	private dispatchSelect(allowMultiCheck: boolean) {
		this.dispatchEvent(new CustomEvent('optionSelection', {
			bubbles: true,
			// composed: true,
			detail: {allowMultiCheck},
		}));
	};
}
