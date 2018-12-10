import {LitElement, html, customElement} from '@polymer/lit-element'
import {repeat} from "lit-html/directives/repeat";
import {Rule} from '../../debugger/constants/Rule'
import './RulesItem'
import './RulesDetails'

import {UrlFilterTypes} from "../../debugger/constants/UrlFilterTypes";
import {RequestTypes} from "../../debugger/constants/RequestTypes";
import {RequestMethods} from "../../debugger/constants/RequestMethods";
import {RequestBodyTypes} from "../../debugger/constants/RequestBodyTypes";
import {ErrorReasons} from "../../debugger/constants/ErrorReasons";

declare global {
	interface HTMLElementTagNameMap {
		'rules-root': RulesRoot;
	}
}

const rules: Rule[] = [{
	id: 0,
	filter: {
		url: {
			type: UrlFilterTypes.StartsWith,
			value: 'http://vlad-accounts.dev.ukr.net/api/v1/token/verification/acquire',
		},
		requestTypes: [RequestTypes.XHR, RequestTypes.Fetch],
		methods: [RequestMethods.GET, RequestMethods.POST],
	},
	mutateRequest: {
		enabled: true,
		endpointReplace: 'https://hacker-server.anonim.com/youtube-stream?url=%protocol%//%hostname%:%port%%path%%query%',
		method: RequestMethods.POST,
		headersToAdd: { 'X-my-header': 'secret-header' },
		headersToRemove: ['s-id'],
		replaceBody: {
			enabled: true,
			type: RequestBodyTypes.Text,
			value: 'new Body',
		},
	},
	mutateResponse: {
		enabled: true,
		responseLocally: false,
		statusCode: 200,
		headersToAdd: { 'X-Sid': 'null' },
		headersToRemove: [],
		replaceBody: {
			enabled: true,
			type: RequestBodyTypes.Text,
			value: 'response body',
		},
	},
	responseError: {
		enabled: false,
		locally: false,
		reason: ErrorReasons.Aborted,
	},
}];


@customElement('rules-root' as any)
export class RulesRoot extends LitElement {

	rules: Rule[] = rules;

	protected render() {
		return html`
		<style>
			@keyframes highlight {
				0% { background: #FF901900; }
				50% { background: #7A401088; }
				100% { background: #FF901900; }
			}
			:host {
				all: initial;
				display: block;
				height: 100%;
				overflow: auto;
				font-family: inherit;
				font-size: inherit;
			}
			#list {
				min-width: 500px;
				margin: 0;
				padding: 0;
			}
			.item {
				display: block;
				position: relative;
			}
			.item:nth-child(odd)::before {
				content: '';
				display: block;
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				background: #2f2f2f;
			}
			.item.highlighted {
				animation: highlight .6s ease-in;
			}
			#placeholder {
				position: relative;
				top: calc(50% - 8px);
				font-size: 12px;
				text-align: center;
				color: #7E7E7E;
			}
		</style>
		<ul id="list">
			${repeat<Rule>(this.rules, rule => rule.id, rule => (
			html`
				<li class="item" id="${`item-${rule.id}`}">
					<rules-item .rule="${rule}">
						<rules-details .rule="${rule}"></rules-details>
					</rules-item>
				</div>
				`
			))}
		</ul>
		${this.rules.length === 0 ? (
			html`<p id="placeholder">No rules yet</p>`
		) : ''}
		`;
	}
	
	public highlightRule(id: number) {
		const node = this.shadowRoot!.querySelector(`#item-${id}`);
		if (node) {
			node.classList.add('highlighted');
			node.addEventListener('animationend', () => {
				node.classList.remove('highlighted');
			}, {
				once: true,
			});
			
			node.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}

		//TODO info popup if no rule (in cale remove rule)
	}
}
