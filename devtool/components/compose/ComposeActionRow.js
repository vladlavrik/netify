const tpl = document.createElement('template');
tpl.innerHTML = `
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
<p id="title"></p>
<div id="content">
	<slot></slot>
</div>
`;

class ComposeActionRow extends HTMLElement {
	static get observedAttributes() {
		return ['title'];
	}

	get title() {
		return this.hasAttribute('title');
	}
	set title(val) {
		this.setAttribute('title', val);
	}

	/** @private*/

	constructor() {
		super();
		const shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.appendChild(tpl.content.cloneNode(true));
        this.blocks = {};

		this.blocks.title = this.shadowRoot.querySelector('#title');
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		switch (attrName) {
			case 'title':
				this.blocks.title.textContent = newVal;
				break
		}
	}

}


customElements.define('compose-action-row', ComposeActionRow);
