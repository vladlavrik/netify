import '../@common/TextField.js'
import './ComposeActionRow.js'
import './ComposeHeadersEditor.js'
import './ComposeBodyEditor.js'

const tpl = document.createElement('template');
tpl.innerHTML = `
<style>
	:host {
		display: block;
	}
	#endpoint {
		display: block;
		width: 100%;
	}
</style>
<compose-action-row title="Replace endpoint:">
	<text-field id="endpoint" placeholder="%protocol%//%hostname%:%port%%path%%query%">
</compose-action-row>
<compose-action-row title="Headers:">
	<compose-headers-editor></compose-headers-editor>
</compose-action-row>
<compose-action-row title="Body:">
	<compose-body-editor></compose-body-editor>
</compose-action-row>
`;

class ComposeRequestAction extends HTMLElement {

	/** @private */
	blocks = {};

	constructor(){
		super();
		const shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.appendChild(tpl.content.cloneNode(true));

		this.blocks.cancelButton = this.shadowRoot.querySelector('#cancel');

	}

	connectedCallback() {
		// this.blocks.cancelButton.addEventListener('click', this.onCancel);
	}

	disconnectedCallback() {
		// this.blocks.cancelButton.removeEventListener('click', this.onCancel);
	}

	onCancel = () => {
		// this.dispatchEvent(new Event('requireComposeHide', {bubbles: true}));
	}
}


customElements.define('compose-request-action', ComposeRequestAction);
