import BaseUIElement from '../../helpers/BaseUIElement.js'
import RadioButton from './RadioButton.js'

export default class RadioGroup extends BaseUIElement {
	static template = BaseUIElement.htmlToTemplate(`
		<style>
			:host {
				all: initial;
				display: block;
				font-family: inherit;
			}
		</style>
		<slot></slot>
	`);

	protected events = [
		{root: true, event: 'radioButtonSelected', handler: this.handleOptionCheck, options: {capture: true}},
		{root: true, event: 'radioButtonRequireFocusNext', handler: this.handleFocusChange, options: {capture: true}},
		{root: true, event: 'radioButtonRequireFocusPrev', handler: this.handleFocusChange, options: {capture: true}},
	];

	get value(): string|null {
		const selectedOption = this.options.find(option => option.selected);
		return selectedOption ? selectedOption.value : null;
	}

	set value(val: string|null) {
		const option = this.options.find(option => option.value === val);
		if (option) {
			option.selected = true;
		}
		this.unselectExcept(option);
	}

	private get options(): RadioButton[] {
		return Array.from(this.querySelectorAll('radio-button'));
	}

	constructor(){
		super();
		this.render();
	}

	private handleOptionCheck(event: Event) {
		event.stopPropagation();
		this.unselectExcept(event.target as RadioButton);
	}

	private handleFocusChange(event: Event) {
		const {options} = this;
		let focusIndex = options.indexOf(event.target as RadioButton);
		if (event.type === 'radioButtonRequireFocusNext') {
			focusIndex++;
		} else {
			focusIndex--;
		}

		if (focusIndex === -1) {
			focusIndex = options.length -1;
		}
		if (focusIndex >= options.length) {
			focusIndex = 0;
		}

		(options[focusIndex] as HTMLElement).focus();
	}

	private unselectExcept(exceptOption?: RadioButton|null) {
		for (const option of this.options) {
			if (option.selected && option !== exceptOption) {
				option.selected = false;
			}
		}
	}
}

customElements.define('radio-group', RadioGroup);
