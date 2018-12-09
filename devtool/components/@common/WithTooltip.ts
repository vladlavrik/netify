import {LitElement, html, customElement, property} from '@polymer/lit-element'
import {classMap} from "lit-html/directives/class-map";

declare global {
	interface HTMLElementTagNameMap {
		'with-tooltip': WithTooltip;
	}
}

@customElement('with-tooltip' as any)
export class WithTooltip extends LitElement {

	@property({attribute: true, type: Boolean, reflect: true})
	disabled?: string;

	private tooltipShown = false;
	public invertedDirection = false;

	constructor (){
		super();
		this.addEventListener('pointerenter', this.showTooltip);
		this.addEventListener('pointerleave', this.hideTooltip);
	}

	render() {
		return html`
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
				position: absolute;
				top: calc(100% + 4px);
				left: 0;
				padding: 2px 4px;
				border: #1a1a1a 1px solid;
				color: #A5A5A5;
				background: #424242;
				animation: showTooltip .1s ease-out .6s; /*delay to show*/
				animation-fill-mode: backwards;
				z-index: 100;
			}
			#tooltip.inverted {
				left: auto;
				right: 0;
			}
		</style>
		<slot></slot>
		${this.tooltipShown ? (
			html`
			<div
				id="tooltip"
				class="${classMap({inverted: this.invertedDirection})}">
				<slot id="tooltipSlot" name="tooltip"></slot>
			</div>
			`
		) : ''}
		`;
	}

	protected updated(changedProperties: Map<string, any>) {
		super.updated(changedProperties);
		if (changedProperties.has('disabled') && this.tooltipShown) {
			this.tooltipShown = false;
			this.requestUpdate('tooltipShown', true);
		}
	}

	public disconnectedCallback() {
		super.disconnectedCallback();
		this.hideTooltip();
	}

	private showTooltip = async () => {
		if (this.disabled || this.tooltipShown) {
			return;
		}

		const minPadding = 8;
		this.tooltipShown = true;
		await this.requestUpdate('tooltipShown', false);

		const slotNodes = (this.shadowRoot!.querySelector('#tooltipSlot') as HTMLSlotElement).assignedNodes();
		const hasContent = Array.from(slotNodes)
			.reduce((total, item) => total + item.textContent, '')
			.trim()
			.length > 0;

		if (!hasContent) { // hide if tooltip is empty
			this.tooltipShown = false;
			await this.requestUpdate('tooltipShown', true);
			return;
		}

		const viewportWidth = document.documentElement!.clientWidth;
		const tooltipWidth = this.shadowRoot!.querySelector('#tooltip')!.clientWidth;

		if (viewportWidth - this.offsetLeft - tooltipWidth < minPadding) {
			// expand to left if at he right is not enough space
			this.invertedDirection = true;
			await this.requestUpdate('invertedDirection', false);
		}
	};

	private hideTooltip = () => {
		if (!this.tooltipShown) {
			return;
		}
		this.tooltipShown = false;
		this.invertedDirection = false;
		this.requestUpdate('tooltipShown', true);
	}
}
