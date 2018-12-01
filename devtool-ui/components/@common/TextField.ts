import BaseUIElement from '../../helpers/BaseUIElement.js';

// TODO border to outline, here and inside other components
type state = {
	placeholder: string,
	maxlength: string,
	disabled: boolean,
}

export default class TextField extends BaseUIElement<state> {
	static template = BaseUIElement.htmlToTemplate(`
		<style>
			:host {
				all: initial;
				display: flex;
				width: 300px;
				box-sizing: border-box;
				border: transparent 1px solid;
				background: #242424;
				color: #A5A5A5;
			}
			:host(:focus) {
				border-color: #356A9E;
			}
			:host([disabled]) {
				border-color: transparent;
				background: #292929;
				color: #CFCFCF;
			}
			#prefix, #suffix {
				flex-shrink: 1;
			}
			#input {
				flex-grow: 1;
				padding: 0 8px;
				border: none;
				line-height: 18px;
				font-size: 11px;
				color: inherit;
				background: transparent;
			}
			#input:focus {
				outline: none;
			}
		</style>
		<div id="prefix">
			<slot name="prefix"></slot>
		</div>
		<input id="input" type="text" spellcheck="false" $placeholder="placeholder" $maxlength="maxlength" $disabled="disabled">
		<div id="suffix">
			<slot name="suffix"></slot>
		</div>
	`);

	protected static boundPropertiesToState = ['placeholder', 'maxlength', 'disabled'];
	protected static boundAttributesToState = ['placeholder', 'maxlength', 'disabled'];
	public static observedAttributes = ['placeholder', 'maxlength', 'disabled'];

	protected get defaultState() {
		return {
			placeholder: '',
			disabled: false,
			value: '',
		};
	}

	public get value () {
		return (this.$.input as HTMLInputElement).value;
	}
	public set value (val) {
		(this.$.input as HTMLInputElement).value = val;
	}

	public placeholder!: string;
	public maxlength!: string;
	public disabled!: boolean;

	constructor(){
		super();
		this.render({delegatesFocus: true});
	}
}


customElements.define('text-field', TextField);
