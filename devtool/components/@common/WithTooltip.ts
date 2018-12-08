import BaseUIElement from '../../helpers/BaseUIElement.js'

type state = {
	disabled: boolean,
	expanded: boolean,
	expandInverted: boolean, // if true, will expand to left instead right direction
}

export default class WithTooltip extends BaseUIElement<state> {

	static template = BaseUIElement.htmlToTemplate(`
		<style>
			@keyframes showTooltip {
				from {opacity: 0;}
				to {opacity: 1;}
			}
			:host {
				all: inherit;
				display: block;
				position: relative;
				margin: 0;
				font-family: inherit;
				font-size: 12px;
			}
			#tooltip{
				display: none;
				position: absolute;
				top: calc(100% + 4px);
				left: 0;
				padding: 2px 4px;
				border: #1a1a1a 1px solid;
				color: #A5A5A5;
				background: #424242;
				z-index: 100;
			}
			#tooltip.visible {
				display: block;
				animation: showTooltip .1s ease-out .6s;
				animation-fill-mode: backwards;
			}
			
			#tooltip.inverted {
				left: auto;
				right: 0;
			}
		</style>
		<slot></slot>
		<div id="tooltip" $classif.visible="expanded" $classif.inverted="expandInverted">
			<slot id="tooltipSlot" name="tooltip"></slot>
		</div>
	`);

	protected static boundPropertiesToState = ['disabled'];
	protected static boundAttributesToState = ['disabled'];
	public static observedAttributes = ['disabled'];

	protected events = [
		{root: true, event: 'pointerenter', handler: this.expand},
		{root: true, event: 'pointerleave', handler: this.collapse}
	];

	protected get defaultState() {
		return {
			disabled: false,
			expanded: false,
			expandInverted: true,
		};
	}

	public disabled!: boolean;
	public expanded!: boolean;
	public expandInverted!: boolean;

	constructor(){
		super();
		this.render();
	}

	public disconnectedCallback() {
		this.collapse();
	}

	protected stateChangedCallback([propName]: string[], _oldValue: any, value: any) {
		if (propName === 'disabled' && value === true) {
			this.collapse();
		}
	};

	private expand() {
		if (this.state.disabled) {
			return;
		}

		const slotNodes = (this.$.tooltipSlot as HTMLSlotElement).assignedNodes();
		const hasContent = Array.from(slotNodes).reduce((total, item) => total + item.textContent, '').trim();
		if (!hasContent) {
			return;
		}

		const minPadding = 8;
		this.state.expanded = true;

		const viewportWidth = document.documentElement!.clientWidth;
		const tooltipWidth = this.$.tooltip.clientWidth;

		if (viewportWidth - this.offsetLeft - tooltipWidth < minPadding) {
			// expand to left
			this.state.expandInverted = true;
		}
	}

	private collapse() {
		this.state.expanded = false;
		this.state.expandInverted = false;
	}
}


customElements.define('with-tooltip', WithTooltip);
