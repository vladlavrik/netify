import '../@common/TextField'
import '../@common/IconButton'

const tpl = document.createElement('template');
tpl.innerHTML = `
<style>
	:host {
		all: initial;
		font-family: inherit;
		display: block;
	}
	.item {
		display: flex;
		align-items: center;
		margin-bottom: 8px;
	}
	.item:last-child {
		margin-bottom: 0px;
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
`;

const itemTpl = document.createElement('template');
itemTpl.innerHTML = `
<article class="item">
	<text-field class="field field-name" placeholder="Header name"></text-field>
	<text-field class="field field-value" placeholder="Header value (leave empty for delete)"></text-field>
	<icon-button class="control control-remove" tooltip="Remove item"></icon-button>
	<icon-button class="control control-add" tooltip="Add header"></icon-button>
</article>
`;


class ComposeHeadersEditor extends HTMLElement {
	constructor(){
		super();
		const shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.appendChild(tpl.content.cloneNode(true));

       this.removeField = event => {
            const itemNode = event.target.parentNode;
            itemNode.querySelector('.control-add').removeEventListener('click', this.addField);
            itemNode.querySelector('.control-remove').removeEventListener('click', this.removeField);
            itemNode.remove();
        }

        this.addField = () => {
            this.shadowRoot.appendChild(itemTpl.content.cloneNode(true));

            const itemNode = this.shadowRoot.lastElementChild;
            itemNode.querySelector('.control-add').addEventListener('click', this.addField);
            itemNode.querySelector('.control-remove').addEventListener('click', this.removeField);
        };

        this.addField();

    }


}


customElements.define('compose-headers-editor', ComposeHeadersEditor);
