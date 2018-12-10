import {LitElement, html, customElement, property} from '@polymer/lit-element'
import {SelectOption, optionValue} from './SelectOption'
import {classMap} from 'lit-html/directives/class-map'
import state from "../../helpers/decorators/state";

declare global {
	interface HTMLElementTagNameMap {
		'select-dropdown': SelectDropdown;
	}
}

/*
 * TODO
 * Attach drop down to the specific component of root
 */

@customElement('select-dropdown' as any)
export class SelectDropdown extends LitElement {

	@property({attribute: true, reflect: true})
	placeholder?: string;

	@property({type: Boolean, attribute: true, reflect: true})
	multiple?: boolean;

	@property()// TODO check is ot okay works
	public get value(): optionValue[] {
		return this.options
			.filter(option => !!option.selected)
			.map(option => option.value);
	}

	public set value(values: optionValue[]) {
		for (const option of this.options) {
			option.selected = values.includes(option.value);
		}
		this.updateLabelValue();
	}

	@state()
	selectedValues: string = '';

	@state()
	expanded = false;

	@state()
	expandInverted = false;

	@state()
	maxHeight: number | null = null;

	private get options(): SelectOption[] {
		return Array.from(this.querySelectorAll('select-option'));
	}

	protected createRenderRoot() {
		return this.attachShadow({mode: 'open', delegatesFocus: true});
	}

	constructor() {
		super();
		this.addEventListener('optionSelection', this.handleOptionSelection as any);
	}

	protected render() {
		return html`
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
			#label.placeholder {
				color: #656565;
			}
			#label:focus {
				outline: none;
				border-color: #356A9E;
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
		<div
			id="label"
			class="${classMap({placeholder: !this.selectedValues})}"
			title="${this.selectedValues}"
			tabindex="0"
			@click="${this.toggleExpansion}"
			@keydown="${this.handleNavigation}"
			@blur="${this.collapse}">
			${this.selectedValues || this.placeholder}
		</div>
		<div
			id="content"
			class="${classMap({
				visible: this.expanded,
				inverted: this.expandInverted,
			})}">
			<slot></slot>
		</div>
		`;
	}

	public connectedCallback() {
		super.connectedCallback();
		this.updateLabelValue();
	}

	public disconnectedCallback() {
		super.disconnectedCallback();
		this.collapse();
	}

	private handleOptionSelection = (event: CustomEvent) => {
		event.stopPropagation();
		const targetOption = event.target as SelectOption;
		if (this.multiple && event.detail.allowMultiCheck) {
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
		this.selectedValues = this.options
			.filter(option => option.selected)
			.map(option => option.textContent)
			.join(', ');
	}

	private handleNavigation = (event: KeyboardEvent) => {
		switch (event.code) {
			case 'Escape':
				this.collapse();
				break;

			case 'Space':
				event.preventDefault();
				if (this.expanded) {
					if (this.multiple) {
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
				if (this.expanded) {
					this.selectHighlighted();
				}
				this.collapse();
				break;

			case 'ArrowUp':
				event.preventDefault();
				if (this.expanded) {
					this.moveHighlight(-1);
				} else {
					this.expand();
				}
				break;

			case 'ArrowDown':
				event.preventDefault();
				if (this.expanded) {
					this.moveHighlight(1);
				} else {
					this.expand();
				}
				break;
		}
	};

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
		let currentIndex = options.findIndex(option => !!option.highlighted);
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

	private async expand() {
		if (this.expanded) {
			return;
		}

		this.expanded = true;
		await this.updateComplete;

		const labelNode = this.shadowRoot!.querySelector('#label')!;
		const contentNode = this.shadowRoot!.querySelector('#content')!;

		const minPadding = 8;
		const viewportHeight = document.documentElement!.clientHeight;
		const labelRect = labelNode.getBoundingClientRect();
		const contentRect = contentNode.getBoundingClientRect();
		let maxHeight;

		if (viewportHeight - contentRect.bottom < minPadding) { // not enough space to expand bottom
			const topFree = labelRect.top;
			const bottomFree = viewportHeight - labelRect.bottom;
			if (topFree > bottomFree) { // if more space above expand to top
				this.expandInverted = true;
				maxHeight = topFree;
			} else {
				maxHeight = bottomFree;
			}
		}

		this.maxHeight = maxHeight ? maxHeight - minPadding : null;
		await this.updateComplete;
	}

	private collapse = () => {
		if (!this.expanded) {
			return;
		}

		this.expanded = false;
		this.expandInverted = false;
		this.maxHeight = null;
	};

	private toggleExpansion = () => {
		if (this.expanded) {
			this.collapse();
		} else {
			this.expand();
		}
	};
}
