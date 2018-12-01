import BaseUIElement from '../../helpers/BaseUIElement.js'

type state = {
	selected: boolean,
	value: string,
}

export default class RadioButton extends BaseUIElement<state> {
	static template = BaseUIElement.htmlToTemplate(`
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
			#indicator.active::before {
				opacity: 1;
			}
			#label {
				margin-left: 8px;
				padding-right: 8px;
				line-height: 14px;
				user-select: none;
			}
		</style>
		<div id="indicator" $classif.active="selected" tabindex="0"></div>
		<div id="label">
			<slot></slot>
		</div>
	`);

	protected events = [
		{root: true, event: 'click', handler: this.handleCheck},
		{root: true, event: 'keydown', handler: this.handleKey},
	];

	protected get defaultState() {
		return {
			selected: false,
			value: '',
		};
	}

	protected static boundPropertiesToState = ['selected', 'value'];
	protected static boundAttributesToState = ['selected', 'value'];
	public static observedAttributes = ['selected', 'value'];

	public selected!: boolean;
	public value!: string;

	constructor(){
		super();
		this.render({delegatesFocus: true});
	}

	protected stateChangedCallback([propName]: string[], _oldValue: any, value: any) {
		if (propName === 'selected' && value === true) {
			this.dispatchEvent(new Event('radioButtonSelected', {bubbles: true}));
		}
	}

	private handleCheck() {
		this.state.selected = true;
	}

	private handleKey(event: KeyboardEvent) {
		switch (event.code) {
			case 'Space':
				event.preventDefault();
				this.state.selected = true;
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
	}
}

customElements.define('radio-button', RadioButton);
