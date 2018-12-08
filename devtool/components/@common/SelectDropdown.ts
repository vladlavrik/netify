import BaseUIElement from '../../helpers/BaseUIElement.js';
import SelectOption from './SelectOption.js'

type state = {
	selectedValues: string,
	placeholder: string,
	expanded: boolean,
	expandInverted: boolean, // if true, will expand to top instead bottom direction
	multiple: boolean,
}

export default class SelectDropdown extends BaseUIElement<state> {
	static template = BaseUIElement.htmlToTemplate(`
		<style>
			:host {
				all: inherit;
				display: block;
				width: 100px;
				position: relative;
				font-family: inherit;
				font-size: 12px;
				color: #A5A5A5;
			}
			#label {
				position: relative;
				max-width: 100%;
				height: 20px;
				padding: 0 14px 0 8px;
				overflow: hidden;
				border: transparent 1px solid;
				border-radius: 2px;
				line-height: 20px;
				background: #242424;
				white-space: nowrap;
				text-overflow: ellipsis;
				user-select: none;
			}
			#label::after {
				content: '';
				display: block;
				position: absolute;
				right: 6px;
				top: 7px;
				width: 7px;
				height: 6px;
				background: #616161;
				clip-path: polygon(0 0, 100% 0, 50% 100%);
			}
			#label:focus {
				outline: none;
				border-color: #356A9E;
			}
			#label:focus {
				outline: none;
				border-color: #356A9E;
			}
			#placeholder {
				color: #656565;
			}
			#content {
				display: none;
				position: absolute;
				top: 100%;
				left: 0;
				right: 0;
				padding: 2px 0;
				overflow-y: scroll;
				border: #1a1a1a 1px solid;
				color: #A5A5A5;
				background: #303030;
				user-select: none;
			}
			#content.visible {
				display: block;
			}
			#content.inverted {
				top: auto;
				bottom: 100%;
			}
		</style>
		<div id="label" tabindex="0" $title="selectedValues">
			<span $if="selectedValues">{selectedValues}</span>
			<span $if="!selectedValues" id="placeholder">{placeholder}</span>
		</div>
		<div id="content" $classif.visible="expanded" $classif.inverted="expandInverted">
			<slot></slot>
		</div>
	`);

	//TODO collapse on disconnect

	protected static boundAttributesToState = ['placeholder', 'multiple'];
	public static observedAttributes = ['placeholder', 'multiple'];

	protected events = [
		{id: 'content', event: 'optionSelection', handler: this.handleOptionSelection},
		{id: 'label', event: 'click', handler: this.toggleExpansion},
		{id: 'label', event: 'keydown', handler: this.handleNavigation},
		{id: 'label', event: 'blur', handler: this.collapse},
	];

	protected get defaultState() {
		return {
			selectedValues: '',
			placeholder: '',
			expanded: false,
			expandInverted: false,
		};
	}

	public get value(): string[] {
		return this.options
			.filter(option => option.selected)
			.map(option => option.value);
	}

	public set value(values: string[]) {
		for (const option of this.options) {
			option.selected = values.includes(option.value);
		}
		this.updateLabelValue();
	}

	private get options(): SelectOption[] {
		return Array.from(this.querySelectorAll('select-option'));
	}

	constructor(){
		super();
		this.render({delegatesFocus: true});
	}

	public connectedCallback() {
		this.updateLabelValue();
	}

	public disconnectedCallback() {
		this.collapse();
	}

	private handleOptionSelection(event: CustomEvent) {
		event.stopPropagation();
		const targetOption = event.target as SelectOption;
		if (this.state.multiple && event.detail.allowMultiCheck) {
			targetOption.selected = !targetOption.selected;
		} else {
			for (const option of this.options) {
				if (option.selected && option !== targetOption) {
					option.selected = false;
				}
			}
			targetOption.selected = true;
			this.collapse();
		}

		this.updateLabelValue();
	};

	private updateLabelValue() {
		this.state.selectedValues = this.options
			.filter(option => option.selected)
			.map(option => option.textContent)
			.join(', ');
	}

	private handleNavigation(event: KeyboardEvent) {
		switch (event.code) {
			case 'Escape':
				this.collapse();
				break;

			case 'Space':
				event.preventDefault();
				if (this.state.expanded) {
					if (this.state.multiple) {
						this.multipleSelectHighlighted();
					} else {
						this.selectHighlighted();
						this.collapse();
					}
				} else {
					this.expand();
				}
				break;

			case 'Enter':
				event.preventDefault();
				if (this.state.expanded) {
					this.selectHighlighted();
				}
				this.collapse();
				break;

			case 'ArrowUp':
				event.preventDefault();
				if (this.state.expanded) {
					this.moveHighlight(-1);
				} else {
					this.expand();
				}
				break;

			case 'ArrowDown':
				event.preventDefault();
				if (this.state.expanded) {
					this.moveHighlight(1);
				} else {
					this.expand();
				}
				break;
		}
	}

	private selectHighlighted() {
		for (const option of this.options) {
			if (option.selected) {
				option.selected = false;
			}
			if (option.highlighted) {
				option.highlighted = false;
				option.selected = true;
			}
		}
		this.updateLabelValue()
	}

	private multipleSelectHighlighted() {
		for (const option of this.options) {
			if (option.highlighted) {
				option.selected = !option.selected;
				break;
			}
		}
		this.updateLabelValue()
	}

	private moveHighlight(increment: -1|1) {
		const {options} = this;
		let currentIndex = options.findIndex(option => option.highlighted);
		let newIndex = currentIndex + increment;

		if (newIndex < 0) {
			newIndex = options.length - 1;
		} else if (newIndex >= options.length) {
			newIndex = 0;
		}

		if (options[currentIndex]) {
			options[currentIndex].highlighted = false;
		}
		options[newIndex].highlighted = true;
	}

	private expand() {
		this.state.expanded = true;

		const minPadding = 8;
		const viewportHeight = document.documentElement!.clientHeight;
		const labelRect = this.$.label.getBoundingClientRect();
		const contentRect = this.$.content.getBoundingClientRect();
		let maxHeight;

		if (viewportHeight - contentRect.bottom < minPadding) { // not enough space to expand bottom
			const topFree = labelRect.top;
			const bottomFree = viewportHeight - labelRect.bottom;
			if (topFree > bottomFree) { // if more space above expand to top
				this.state.expandInverted = true;
				maxHeight = topFree;
			} else {
				maxHeight = bottomFree;
			}
		}

		if (maxHeight) {
			maxHeight -= minPadding;
			(this.$.content as HTMLElement).style.maxHeight = maxHeight + 'px';
		}
	}

	private collapse() {
		this.state.expanded = false;
		this.state.expandInverted = false;
		delete (this.$.content as HTMLElement).style.maxHeight;
	}

	private toggleExpansion() {
		if (this.state.expanded) {
			this.collapse();
		} else {
			this.expand();
		}
	}
}

customElements.define('select-dropdown', SelectDropdown);
