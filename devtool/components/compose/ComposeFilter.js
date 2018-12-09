import '../@common/TextField'
import '../@common/SelectDropdown'
import '../@common/SelectOption'

const tpl = document.createElement('template');
tpl.innerHTML = `
<style>
	:host {
		display: flex;
	}
	#url {
		flex-grow: 20;
	}
	#url-type {
		width: 86px;
		margin-left: 8px;
	}
	.separator {
		width: 1px;
		height: 20px;
		margin: 0 8px;
		background: #616161;
	}
	#request-type {
		width: 100px;
	}
	#method {
		width: 100px;
		margin-left: 8px;
	}
	@media (max-width: 699px) {
		:host {
			flex-wrap: wrap;
		}
		.separator {
			width: 100%;
			height: 0;
			margin: 4px 0;
		}
	}
</style>
<text-field id="url" placeholder="Url"></text-field>
<select-dropdown id="url-type">
	<select-option value="StartsWith" selected>Starts with</select-option>
	<select-option value="Exact">Exact</select-option>
	<select-option value="RegExp">RegExp</select-option>
</select-dropdown>
<div class="separator"></div>
<select-dropdown id="request-type" placeholder="All types" multiple>
	<select-option value="XHR">XHR</select-option>
	<select-option value="Fetch">Fetch</select-option>
	<select-option value="Script">Script</select-option>
	<select-option value="Stylesheet">Stylesheet</select-option>
	<select-option value="Document">Document</select-option>
	<select-option value="Font">Font</select-option>
	<select-option value="Image">Image</select-option>
	<select-option value="Media">Media</select-option>
	<select-option value="Manifest">Manifest</select-option>
</select-dropdown>
<select-dropdown id="method" placeholder="All methods" multiple>
	<select-option value="GET">GET</select-option>
	<select-option value="POST">POST</select-option>
	<select-option value="PUT">PUT</select-option>
	<select-option value="DELETE">DELETE</select-option>
	<select-option value="HEAD">HEAD</select-option>
	<select-option value="PATCH">PATCH</select-option>
</select-dropdown>
`;

class ComposeFilter extends HTMLElement {


	constructor(){
		super();
		const shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.appendChild(tpl.content.cloneNode(true));
	}

	connectedCallback() {
		setTimeout(() => {
			this.shadowRoot.querySelector('#url').testprop = 'y1';
		}, 500)
	}

	disconnectedCallback() {
	}

	getValue() {
		return {
			url: null,
			urlCompare: this.shadowRoot.querySelector('#url-type').value,
			types: this.shadowRoot.querySelector('#request-type').value,
		}
	}
}


customElements.define('compose-filter', ComposeFilter);
