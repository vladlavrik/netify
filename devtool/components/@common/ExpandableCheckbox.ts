import {LitElement, html, customElement, property} from '@polymer/lit-element'
import {classMap} from "lit-html/directives/class-map";

declare global {
	interface HTMLElementTagNameMap {
		'expandable-checkbox': ExpandableCheckbox;
	}
}

@customElement('expandable-checkbox' as any)
export class ExpandableCheckbox extends LitElement {

	@property({attribute: true, reflect: true})
	label?: string;

	@property({attribute: true, type: Boolean, reflect: true})
	expanded = false;

	@property({attribute: true, type: Boolean, reflect: true})
	disabled = false;

	protected render() {
		return html`
		<style>
			:host {
				all: inherit;
				display: block;
				padding: 0;
				margin: 8px 0;
				font-family: inherit;
			}
			#label-wrapper::after {
				content: '';
				display: block;
				clear: both;
			}
			#label {
				float: left;
				margin: 0;
				line-height: 20px;
				font-size: 12px;
				color: #A5A5A5;
				cursor: pointer;
				user-select: none;
			}
			#label::before {
				content: '';
				float: left;
				width: 18px;
				height: 18px;
				border: transparent 1px solid;
				border-radius: 50%;
				margin-right: 4px;
				background: url("/devtool/styles/icons/check-inactive.svg") no-repeat center;
			}
			#label:focus {
				outline: none;
			}
			#label:focus::before {
				border-color: #356A9E;
			}
			#label.active::before {
				background: url("/devtool/styles/icons/check-active.svg") no-repeat center;
			}
			:host([disabled]) #label {
				opacity: .5;
				cursor: default;
			}
		</style>
		<div id="label-wrapper">
			<p
				id="label"
				class="${classMap({active: this.expanded})}"
				tabindex="0"
				@click="${this.handleToggle}"
				@keydown="${this.handleKeyDown}">
				${this.label}
			</p>
		</div>
		${this.expanded ? (
			html`
			<div>
				<slot></slot>
			</div>
			`
		) : ''}
		`;
	}

	private handleKeyDown = (event: KeyboardEvent) => {
		if (['Space', 'Enter'].includes(event.code)) {
			event.preventDefault();
			this.handleToggle();
		}
	};

	private handleToggle = () => {
		if (this.disabled) { // disallow expand if disabled
			return;
		}

		this.expanded = !this.expanded;
		this.requestUpdate('expanded', !this.expanded);
	};
}

