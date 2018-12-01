import BaseUIElement from '../../helpers/BaseUIElement.js';

type state = {
	placeholder: string,
	maxlength: string,
	disabled: boolean,
}

export default class TextAreaField extends BaseUIElement<state> {
	static template = BaseUIElement.htmlToTemplate(`
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
		<textarea id="input" spellcheck="false" $placeholder="placeholder" $maxlength="maxlength" $disabled="disabled"></textarea>
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


customElements.define('text-area-field', TextAreaField);
