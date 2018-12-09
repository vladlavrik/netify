import '../@common/RadioGroup'
import '../@common/RadioButton'
import '../@common/TextAreaField'

const tpl = document.createElement('template');
tpl.innerHTML = `
<style>
	:host {
		display: block;
	}
	#type {
		display: flex;
		margin-bottom: 8px;
	}
	.type-item {
		margin-right: 20px;
	}
	#content {
		width: 100%;
	}
</style>
<radio-group id="type">
	<radio-button class="type-item" value="Text" selected>Text</radio-button>
	<!--<radio-button class="type-item" value="JSON">JSON</radio-button>-->
	<radio-button class="type-item" value="Base64">Base64</radio-button>
	<!--<radio-button class="type-item" value="File">File</radio-button>-->
</radio-group>
<text-area-field id="content" placeholder="Body content"></text-area-field>
`;

class ComposeBodyEditor extends HTMLElement {


	constructor(){
		super();
		const shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.appendChild(tpl.content.cloneNode(true));
      this.blocks = {};

		this.blocks.cancelButton = this.shadowRoot.querySelector('#cancel');

	}

	connectedCallback() {
	}

	disconnectedCallback() {
	}
}


customElements.define('compose-body-editor', ComposeBodyEditor);
