import BaseUIElement from '../../helpers/BaseUIElement.js'
import './WithTooltip.js'

type state = {
	tooltip: string,
	disabled: boolean,
}

class IconButton extends BaseUIElement<state> {
	static template = BaseUIElement.htmlToTemplate(`
		<style>
			:host {
				all: initial;
				display: block;
				width: 18px;
				height: 18px;
				font-family: inherit;
			}
			:host(:focus) {
				outline: none;
				width: 18px;
				height: 18px;
			}
			#button {
				display: block;
				width: 100%;
				height: 100%;
				border: none;
				padding: 0;
				background: none;
			}
			#button::before {
				content: '';
				display: block;
				width: 100%;
				height: 100%;
				opacity: 0.75;
				background: var(--icon-button-bg, none) center no-repeat;
				transform: rotate(var(--icon-button-rotate, 0));
				clip-path: var(--icon-button-clip, none);
			}
			#button:hover::before {
				opacity: 1;
			}
			:host(:focus) #button {
				outline: #356A9E solid 1px;
			}
			#button[disabled]::before {
				opacity: 0.5;
				outline: none;
			}
			#tooltip {
				white-space: nowrap;
			}
		</style>
		<with-tooltip $disabled="disabled">
			<button id="button" type="button" $disabled="disabled"></button>
			<span id="tooltip" slot="tooltip">{tooltip}</span>
		</with-tooltip>
	`);

	protected static boundPropertiesToState = ['tooltip', 'disabled'];
	protected static boundAttributesToState = ['tooltip', 'disabled'];
	public static observedAttributes = ['tooltip', 'disabled'];

	public tooltip!: string;
	public disabled!: boolean;

	protected get defaultState() {
		return {
			tooltip: '',
			disabled: false,
		};
	}

	constructor(){
		super();
		this.render({delegatesFocus: true});
	}
}

customElements.define('icon-button', IconButton);
