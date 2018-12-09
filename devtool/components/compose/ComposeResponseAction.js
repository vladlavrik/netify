import '../@common/TextField'
import './ComposeActionRow.js'
import './ComposeHeadersEditor.js'
import './ComposeBodyEditor.js'

const tpl = document.createElement('template');
tpl.innerHTML = `
<style>
	:host {
		display: block;
	}
	#response-point {
		display: flex;
	}
	.response-point-item {
		margin-right: 16px;
	}
	#status-code {
		width: 168px;
	}
</style>
<compose-action-row title="Response point:">
	<radio-group id="response-point">
		<radio-button class="response-point-item" value="remotely" selected>Pass to server</radio-button>
		<radio-button class="response-point-item" value="locally">Response locally</radio-button>
	</radio-group>
</compose-action-row>
<compose-action-row title="Status code:">
	<text-field id="status-code" placeholder="Default - from server or 200" maxlength="3"></text-field>
</compose-action-row>
<compose-action-row title="Headers:">
	<compose-headers-editor></compose-headers-editor>
</compose-action-row>
<compose-action-row title="Body:">
	<compose-body-editor></compose-body-editor>
</compose-action-row>
`;

class ComposeResponseAction extends HTMLElement {

	/** @private */


	constructor(){
		super();
		const shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.appendChild(tpl.content.cloneNode(true));
        this.blocks = {};
		this.blocks.cancelButton = this.shadowRoot.querySelector('#cancel');

	}

	connectedCallback() {
		// this.blocks.cancelButton.addEventListener('click', this.onCancel);
	}

	disconnectedCallback() {
		// this.blocks.cancelButton.removeEventListener('click', this.onCancel);
	}

}


customElements.define('compose-response-action', ComposeResponseAction);
