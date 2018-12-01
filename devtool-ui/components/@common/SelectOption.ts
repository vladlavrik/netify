import BaseUIElement from '../../helpers/BaseUIElement.js'

type state = {
	selected: boolean,
	highlighted: boolean,
	value: string,
}

export default class SelectOption extends BaseUIElement<state> {
	/*
	 * TODO
	 * notify about connect to DOM to SelectDropdown update options list
	 **/
	static template = BaseUIElement.htmlToTemplate(`
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
			#wrapper.active {
				background: #424242;
			}
			#wrapper:hover,
			#wrapper.highlighted {
				background: #356A9E;
			}
		</style>
		<div id="wrapper" $classif.highlighted="highlighted" $classif.active="selected">
			<slot></slot>
		</div>
		</label>
	`);

	protected events = [
		{root: true, event: 'click', handler: this.handleSelectByClick},
	];

	protected get defaultState() {
		return {
			highlighted: false,
			selected: false,
			value: '',
		};
	}

	protected static boundPropertiesToState = ['selected', 'highlighted', 'value'];
	protected static boundAttributesToState = ['selected', 'value'];
	public static observedAttributes = ['selected', 'value'];

	public selected!: boolean;
	public highlighted!: boolean;
	public value!: string;

	constructor(){
		super();
		this.render();
	}

	public attributeChangedCallback(attrName: string, oldValue: any, value: any) {
		super.attributeChangedCallback(attrName, oldValue, value);
		if (attrName === 'selected' && value !== null) {
			this.dispatchSelect(true);
		}
	}

	private handleSelectByClick(event: MouseEvent) {
		const allowMultiCheck = event.metaKey || event.shiftKey;
		this.dispatchSelect(allowMultiCheck);
	}

	private dispatchSelect(allowMultiCheck: boolean) {
		this.dispatchEvent(new CustomEvent('optionSelection', {
			bubbles: true,
			composed: true,
			detail: {allowMultiCheck},
		}));
	};
}


customElements.define('select-option', SelectOption);
