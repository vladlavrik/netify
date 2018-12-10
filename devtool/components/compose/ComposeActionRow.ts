import {LitElement, html, customElement, property} from '@polymer/lit-element'

declare global {
	interface HTMLElementTagNameMap {
		'compose-action-row': ComposeActionRow;
	}
}

@customElement('compose-action-row' as any)
export class ComposeActionRow extends LitElement {
	@property({attribute: true, reflect: true})
	title!: string;

	protected render() {
		return html`
		<style>
			:host {
				all: inherit;
				display: flex;
				font-family: inherit;
				margin: 8px 0 16px 0;
			}
			#title {
				flex-basis: 128px;
				flex-shrink: 0;
				margin: 0 8px 0 24px;
				font-size: 12px;
				line-height: 20px;
				color: #A5A5A5;
				cursor: pointer;
			}
			#content {
				flex-grow: 1;
			}
		</style>
		<p id="title">${this.title}</p>
		<div id="content">
			<slot></slot>
		</div>
		`;
	}
}
