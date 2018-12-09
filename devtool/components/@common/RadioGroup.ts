import {LitElement, html, customElement, property} from '@polymer/lit-element'
import {RadioButton, radioValue} from './RadioButton'

declare global {
	interface HTMLElementTagNameMap {
		'radio-group': RadioGroup;
	}
}

@customElement('radio-group' as any)
export class RadioGroup extends LitElement {

	@property()
	get value(): radioValue | null {
		const selectedOption = this.options.find(option => !!option.selected);
		return selectedOption ? selectedOption.value : null;
	}
	set value(val: radioValue | null) {
		const option = this.options.find(option => option.value === val);
		if (option) {
			option.selected = true;
		}
		this.unselectExcept(option);
	}

	private get options(): RadioButton[] {
		return Array.from(this.querySelectorAll('radio-button'));
	}

	constructor() {
		super();
		this.addEventListener('radioButtonSelected', this.handleOptionCheck, {capture: true});
		this.addEventListener('radioButtonRequireFocusNext', this.handleFocusChange, {capture: true});
		this.addEventListener('radioButtonRequireFocusPrev', this.handleFocusChange, {capture: true});
	}

	protected render() {
		return html`
		<style>
			:host {
				all: initial;
				display: block;
				font-family: inherit;
			}
		</style>
		<slot></slot>
		`;
	}


	private handleOptionCheck = (event: Event) => {
		event.stopPropagation();
		this.unselectExcept(event.target as RadioButton);
	};

	private handleFocusChange = (event: Event) => {
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
	};

	private unselectExcept(exceptOption?: RadioButton|null) {
		for (const option of this.options) {
			if (option.selected && option !== exceptOption) {
				option.selected = false;
			}
		}
	}
}
