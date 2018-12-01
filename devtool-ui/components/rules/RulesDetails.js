import '../@common/IconButton.js'

const tpl = document.createElement('template');
tpl.innerHTML = `
<style>
	:host {
		all: inherit;
		display: block;
		align-items: center;
		font-family: inherit;
		font-size: 12px;
		background: #383838;
	}
	.data-table {
	
	}
	.data-row {
	}
	.data-title {
		color: #717171;
		padding: 4px 16px 4px 24px;
		vertical-align: top;
	}
	.data-value {
		color: #B1B9C0;
		padding: 4px 0;
	}
	.separator {
		height: 1px;
		background: #555555;
		margin: 8px 0;
	}
	.separator_top {
		margin-top: 0;
	}
</style>
<div class="separator separator_top"></div>
<table class="data-table">
	<tr class="data-row">
		<td class="data-title">Url:</td>
		<td class="data-value">{value}</td>
	</tr>
	<tr class="data-row">
		<td class="data-title">Methods:</td>
		<td class="data-value">{value}</td>
	</tr>
	<tr class="data-row">
		<td class="data-title">Request types:</td>
		<td class="data-value">{value}</td>
	</tr>
</table>
<div class="separator"></div>
<table class="data-table">
	<tr class="data-row">
		<td class="data-title">Request endpoint:</td>
		<td class="data-value">{value}</td>
	</tr>
	<tr class="data-row">
		<td class="data-title">Added request headers:</td>
		<td class="data-value">{value}</td>
	</tr>
	<tr class="data-row">
		<td class="data-title">Removed request headers:</td>
		<td class="data-value">{value}<br>dasda<br>sdfas<br>sdfas<br>sdfas</td>
	</tr>
	<tr class="data-row">
		<td class="data-title">Replaced request body</td>
		<td class="data-value">{value}<br>dasda<br>sdfas<br>sdfas<br>sdfas</td>
	</tr>
</table>
<div class="separator"></div>
<table class="data-table">
	<tr class="data-row">
		<td class="data-title">Response status</td>
		<td class="data-value">{value}</td>
	</tr>
	<tr class="data-row">
		<td class="data-title">Added response headers:</td>
		<td class="data-value">{value}</td>
	</tr>
	<tr class="data-row">
		<td class="data-title">Removed response headers:</td>
		<td class="data-value">{value}</td>
	</tr>
	<tr class="data-row">
		<td class="data-title">Replaced response body</td>
		<td class="data-value">{value}</td>
	</tr>
</table>
<div class="separator"></div>
<table class="data-table">
	<tr class="data-row">
		<td class="data-title">Response error:</td>
		<td class="data-value">{value}</td>
	</tr>
</table>
`;


class RulesDetails extends HTMLElement {
	static get observedAttributes() {
		return ['timestamp', 'method', 'type', 'url'];
	}

	/** @private*/
	blocks = {};

	constructor(){
		super();
		const shadowRoot = this.attachShadow({mode: 'open'});
		shadowRoot.appendChild(tpl.content.cloneNode(true));

		this.blocks = {
			time: this.shadowRoot.querySelector('#time'),
			method: this.shadowRoot.querySelector('#method'),
			type: this.shadowRoot.querySelector('#type'),
			url: this.shadowRoot.querySelector('#url'),
		};
	}

}


customElements.define('rules-details', RulesDetails);
