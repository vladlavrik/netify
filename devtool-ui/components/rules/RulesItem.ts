import BaseUIElement from '../../helpers/BaseUIElement.js';
import '../@common/IconButton.js'

type state = {
	ruleId: string,
	methods: string[],
	requestTypes: string[],
	url: string,
	actions: string[],
	formattedMethods: string,
	formattedRequestTypes: string,
	formattedUrl: string,
	formattedActions: string,
	expanded: boolean,
}

export default class RulesItem extends BaseUIElement<state> {

	static template = BaseUIElement.htmlToTemplate(`
		<style>
			:host {
				all: inherit;
				display: block;
				font-family: inherit;
				font-size: 12px;
				min-height: 48px;
			}
			:host(:nth-child(odd)) {
				background: #2f2f2f;
			}
			#entry {
				display: flex;
				align-items: center;
				color: #B1B9C0;
			}
			#expand-button {
				flex-shrink: 0;
				margin: 0 3px;
				--icon-button-bg: #616161;
				--icon-button-clip: polygon(30% 34%, 70% 34%, 50% 66%);
			}
			#summary {
				flex-grow: 1;
				overflow: hidden;
			}
			#filter-info {
				display: flex;
				margin-top: 8px;
			}
			#method, #type {
				width: 120px;
				min-width: 100px;
			}
			#url {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			#actions-info {
				margin: 4px 0 8px 0;
				color: #7E7E7E;
			}
			#remove-button {
				flex-shrink: 0;
				margin: 0 6px 0 12px;
				--icon-button-bg: url("/devtool-ui/styles/icons/remove.svg");
				cursor: pointer;
			}
			.placeholder {
				color: #616161;
			}
			.value:empty > .placeholder {
				display: block;
			}
		</style>
		<div id="entry">
			<icon-button id="expand-button"></icon-button>
			<div id="summary">
				<div id="filter-info">
					<span class="value" id="method">
						{formattedMethods}
						<span $if="!formattedMethods" class="placeholder">All methods</span>
					</span>
					<span class="value" id="type">
						{formattedRequestTypes}
						<span $if="!formattedRequestTypes" class="placeholder">All types</span>
					</span>
					<span class="value" id="url" title="">
						{formattedUrl}
						<span $if="!formattedUrl" class="placeholder">Any url</span>
					</span>
				</div>
				<p id="actions-info">
					<span $if="actions includes replaceEndpoint" class="action-item">Replace request endpoint</span>
					<span $if="actions includes requestHeaders" class="action-item">Modify request headers</span>
					<span $if="actions includes requestBody" class="action-item">Defined request body</span>
					<span $if="actions includes responseLocally" class="action-item">Response locally</span>
					<span $if="actions includes responseStatus" class="action-item">Modify response status</span>
					<span $if="actions includes responseHeaders" class="action-item">Modify response header</span>
					<span $if="actions includes responseBody" class="action-item">Defined response body</span>
					<span $if="actions includes responseError" class="action-item">Return error</span>
				</p>
			</div>
			<icon-button id="remove-button" tooltip="Remove the rule"></icon-button>
		</div>
		<div $if="expanded" id="details">
			<slot></slot>
		</div>
	`);

	static boundPropertiesToState = ['timestamp', 'methods', 'requestTypes', 'url', 'actions'];
	static boundAttributesToState = ['rule-id'];
	static observedAttributes = ['rule-id'];

	public methods!: string[];
	public requestTypes!: string[];
	public url!: string;
	public actions!: string[];

	protected events = [
		{id: 'expand-button', event: 'click', handler: this.handleExpand},
		{id: 'remove-button', event: 'click', handler: this.handleRemove},
	];

	constructor() {
		super();
		this.render();
		this.state.expanded = true;

	}

	protected stateChangedCallback([propName]: string[], _oldValue: any, value: any) {
		switch (propName) {
			case 'methods':
				this.state.formattedMethods = (value as state['methods']).join('/');
				break;
			case 'requestTypes':
				this.state.formattedRequestTypes= (value as state['requestTypes']).join('/');
				break;
			case 'url':
				this.state.formattedUrl= (value as state['url']);
				break;
			case 'actions':
				this.state.formattedActions = (value as state['actions']).join('|');
				break;
		}
	}

	private handleExpand() {
		this.state.expanded = !this.state.expanded;
	}

	private handleRemove() {
		console.log('remove', this.state.ruleId);
	}
}


customElements.define('rules-item', RulesItem);
