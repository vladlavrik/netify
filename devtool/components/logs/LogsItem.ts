import {LitElement, html, customElement, property} from '@polymer/lit-element'
import {Log} from "../../debugger/constants/Log";
import '../@common/IconButton'

declare global {
	interface HTMLElementTagNameMap {
		'logs-item': LogsItem;
	}
}

const visibleDateFormat = {
	minute: '2-digit',
	second: '2-digit',
};

const titleDateFormat = {
	year: 'numeric',
	day: 'numeric',
	month: 'short',
	minute: '2-digit',
	second: '2-digit',
};

@customElement('logs-item' as any)
export class LogsItem extends LitElement {
	@property({attribute: true, type: Number, reflect: true})
	requestIdId!: string;
	
	@property()
	log!: Log;
	
	protected render() {
		const {date, method, requestType, url} = this.log;
		const formattedTime = LogsItem.formatTime(date);
		const fullDate = date.toLocaleString('en-US', titleDateFormat);

		return html`
		<style>
			:host {
				all: inherit;
				display: flex;
				align-items: center;
				font-family: inherit;
				font-size: 12px;
				color: #B1B9C0;
				height: 28px;
			}
			#time {
				width: 56px;
				margin: 0 8px;
				flex-shrink: 0;
				opacity: 0.5;
			}
			#method {
				width: 48px;
				flex-shrink: 0;
			}
			#type {
				width: 58px;
				margin: 0 8px;
				flex-shrink: 0;
			}
			#url {
				flex-grow: 1;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			#follow-button {
				flex-shrink: 0;
				margin: 0 6px;
				--icon-button-bg: url("/devtool/styles/icons/follow.svg");
				cursor: pointer;
			}
		</style>
		<span id="time" title="${fullDate}">${formattedTime}</span>
		<span id="method">${method}</span>
		<span id="type">${requestType}</span>
		<span id="url" title="${url}">${url}</span>
		<icon-button
			id="follow-button"
			tooltip="Highlight rule"
			@click="${this.onFollowRule}">
		</icon-button>
		`;
	}

	private static formatTime(date: Date) {
		const time = date.toLocaleString('en-US', visibleDateFormat);
		const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
		return `${time}.${milliseconds}`;
	}

	private onFollowRule = () => {
		this.dispatchEvent(new CustomEvent('requireRuleHighlight', {
			bubbles: true,
			composed: true,
			detail: {
				ruleId: this.log.ruleId,
			},
		}));
	};
}
