import BaseUIElement from '../../helpers/BaseUIElement.js';

type state = {
	title: string,
	expanded: boolean,
	disabled: boolean,
}

class ExpandableCheck extends BaseUIElement<state> {
	static template = BaseUIElement.htmlToTemplate(`
		<style>
			:host {
				all: inherit;
				display: block;
				padding: 0;
				margin: 8px 0;
				font-family: inherit;
			}
			#title-wrapper::after {
				content: '';
				display: block;
				clear: both;
			}
			#title {
				float: left;
				margin: 0;
				line-height: 20px;
				font-size: 12px;
				color: #A5A5A5;
				cursor: pointer;
				user-select: none;
			}
			#title::before {
				content: '';
				float: left;
				width: 18px;
				height: 18px;
				border: transparent 1px solid;
				border-radius: 50%;
				margin-right: 4px;
				background: url("/devtool-ui/styles/icons/check-inactive.svg") no-repeat center;
			}
			#title:focus {
				outline: none;
			}
			#title:focus::before {
				border-color: #356A9E;
			}
			#title.active::before {
				background: url("/devtool-ui/styles/icons/check-active.svg") no-repeat center;
			}
			:host([disabled]) #title {
				opacity: .5;
				cursor: default;
			}
			#content {
				display: none;
			}
			#content {
				display: block;	
			}
		</style>
		<div id="title-wrapper">
			<p id="title" tabindex="0" $classif.active="expanded">{title}</p>
		</div>
		<div id="content" $if="expanded">
			<slot></slot>
		</div>
	`);


	protected static boundPropertiesToState = ['title', 'expanded', 'disabled'];
	protected static boundAttributesToState = ['title', 'expanded', 'disabled'];
	public static observedAttributes = ['title', 'expanded', 'disabled'];

	protected events = [
		{id: 'title', event: 'click', handler: this.handleToggle},
		{id: 'content', event: 'keydown', handler: this.handleKeyDown},
	];

	protected get defaultState() {
		return {
			title: '',
			expanded: false,
			disabled: false,
		};
	}

	public title!: string;
	public expanded!: boolean;
	public disabled!: boolean;

	constructor() {
		super();
		this.render();
	}

	private handleKeyDown(event: KeyboardEvent) {
		if (['Space', 'Enter'].includes(event.code)) {
			event.preventDefault();
			this.handleToggle();
		}
	}

	private handleToggle() {
		if (this.state.disabled) { // disallow expand if disabled
			return;
		}

		this.state.expanded = !this.state.expanded;
	}
}

customElements.define('expandable-check', ExpandableCheck);
