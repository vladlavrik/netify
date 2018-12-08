import BaseUIElement from '../../helpers/BaseUIElement.js';
import '../@common/IconButton.js'

type state = {
	timestamp: string,
	formattedTime: string,
	method: string,
	type: string,
	url: string,
}

class LogsItem extends BaseUIElement<state> {
	static template = BaseUIElement.htmlToTemplate(`
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
			:host(:nth-child(odd)) {
				background: #2f2f2f;
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
		<span id="time">{formattedTime}</span>
		<span id="method">{method}</span>
		<span id="type">{type}</span>
		<span id="url" $title="url">{url}</span>
		<icon-button id="follow-button" tooltip="To rule"></icon-button>
	`);

	static boundPropertiesToState = ['timestamp', 'method', 'type', 'url'];
	static boundAttributesToState = ['timestamp', 'method', 'type', 'url'];
	static observedAttributes = ['timestamp', 'method', 'type', 'url'];

	public timestamp!: string;
	public method!: string;
	public type!: string;
	public url!: string;


	protected events = [
		{id: 'follow', event: 'click', handler: this.handleFollowRule},
	];

	constructor(){
		super();
		this.render();
		this.parseTime(this.state.timestamp);
	}

	protected stateChangedCallback([propName]: string[], _oldValue: any, value: any) {
		if (propName === 'attrName') {
			this.parseTime(value);
		}
	}

	private parseTime(value: string) {
		const date = new Date(Number(value));
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const seconds = date.getSeconds().toString().padStart(2, '0');
		const milliseconds = date.getMilliseconds().toString().padStart(2, '0');

		this.state.formattedTime = `${minutes}:${seconds}.${milliseconds}`;
	}

	private handleFollowRule() {

	}
}


customElements.define('logs-item', LogsItem);
