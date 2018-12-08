import BaseUIElement from '../../helpers/BaseUIElement.js';
import RulesItem from './RulesItem.js'
import './RulesItem.js'
import './RulesDetails.js'


class RulesSection extends BaseUIElement {
	static template = BaseUIElement.htmlToTemplate(`
		<style>
			:host {
				all: initial;
				display: block;
				height: 100%;
				overflow: auto;
				font-family: inherit;
				font-size: inherit;
			}
		
			#root{
				min-width: 500px;
			}
		</style>
		<div id="root"></div>
	`);

	constructor(){
		super();
		this.render();


		for (const _ of rules) {
			const entryNode = document.createElement('rules-item') as RulesItem;
			entryNode.methods = ['GET', 'POST'];
			entryNode.url = 'http://vlad-accounts.dev.ukr.net/api/v1/token/verification/acquire';
			entryNode.actions = ['requestHeaders', 'responseStatus'];
			entryNode.setAttribute('rule-id', '1');


			const detailsNode = document.createElement('rules-details');
			entryNode.appendChild(detailsNode);

			this.$.root.appendChild(entryNode);
		}
	}
}


const rules = [{
	id: 0,
	filter: {
		url: {
			type: 'exact',
			value: 'http://vlad-accounts.dev.ukr.net/api/v1/token/verification/acquire'
		},
		requestTypes: ['XHR, Fetch'],
		methods: ['POST'],
	},
	actions: {
		responseError: {
			enabled: true,
			reason: 'BlockedByClient',
			locally: true,
		},
		/*		throttle: {
					enabled: true,
					staticWaitTime: 36000, // ms, one of
					speedLimit: 36000, //Kb per second
				},*/
		mutateRequest: {
			enabled: true,
			endpointReplace: [
				{type: 'text', value: 'https://hacker-server.anonim.com/youtube-stream'},
				{type: 'proxyPart', value: 'query'},
				{type: 'text', value: '&api-version='},
				{type: 'proxyPart', value: 'path'},
				{type: 'proxyValue', value: '1'},
				{type: 'text', value: '&type='},
				{type: 'proxyValue', value: '2'}
			],
			method: 'POST',
			headersToAdd: {
				'X-Some-Request-Header': 'true',
			},
			headersToRemove: [
				'X-Some-Request-Header',
			],
			replaceBody: {
				enabled: true,
				type: 'base64',
				value: 'eyJhIjoic3VjY2VzcyJ9'
			},
		},
		mutateResponse: {
			enabled: true,
			responseLocally: true,
			statusCode: 200,
			headersToAdd: {
				'X-Some-Response-Header': 'true',
			},
			headersToRemove: [
				'X-Some-Response-Header',
			],
			replaceBody: {
				enabled: true,
				type: 'base64',
				value: 'eyJhIjoic3VjY2VzcyJ9'
			},
		},
	},

}, {}];



customElements.define('rules-section', RulesSection);
