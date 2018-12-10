import {LitElement, html, customElement} from '@polymer/lit-element';
import {repeat} from "lit-html/directives/repeat";
import state from "../../helpers/decorators/state";
import '../@common/TextField';
import '../@common/IconButton';

declare global {
	interface HTMLElementTagNameMap {
		'compose-headers-editor': ComposeHeadersEditor;
	}
}

@customElement('compose-headers-editor' as any)
export class ComposeHeadersEditor extends LitElement {
	@state()
	items: number[] = [];

	idIncrement = 0;

	constructor() {
		super();
		this.addItem();
	}

	protected render() {
		return html`
		<style>
			:host {
				all: initial;
				font-family: inherit;
				display: block;
			}
			#list {
				margin: 0;
				padding: 0;
			}
			.item {
				display: flex;
				align-items: center;
				margin-bottom: 8px;
			}
			.item:last-child {
				margin-bottom: 0;
			}
			.field {
				min-width: 0;
				width: 0;
				max-width: 216px;
				flex-grow: 1;
			}
			.field-value {
				margin: 0 8px 0 16px;
			}
			.control {
				flex-shrink: 0;
			}
			.control-add {
				display: none;
				--icon-button-bg: url('/devtool/styles/icons/add.svg');
			}
			.control-remove {
				--icon-button-bg: url('/devtool/styles/icons/remove.svg');
			}
			.item:last-child .control-add {
				display: block;
			}
			.item:last-child .control-remove {
				display: none;
			}
		</style>
	
		<ul id="list">
		${repeat(this.items, i => i, id => (
			html`
			<li class="item">
				<text-field class="field field-name" placeholder="Header name"></text-field>
				<text-field class="field field-value" placeholder="Header value (leave empty for delete)"></text-field>
				<icon-button
					class="control control-remove"
					tooltip="Remove item"
					data-item-id="${id}"
					@click="${this.removeItem}">
				</icon-button>
				<icon-button
					class="control control-add"
					tooltip="Add header"
					@click="${this.addItem}">
				</icon-button>
			</li>
			`
		))}	
		</ul>
		`;
	}

	private addItem() {
		this.items = [...this.items, this.idIncrement++];
	}

	private removeItem(event: MouseEvent) {
		const removeId = Number((event.currentTarget as HTMLElement).dataset.itemId);
		this.items = this.items.filter(id => id !== removeId);
	}
}
