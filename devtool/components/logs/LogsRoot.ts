import {LitElement, html, customElement} from '@polymer/lit-element'
import {repeat} from "lit-html/directives/repeat";
import state from "../../helpers/decorators/state";
import {Log} from '../../debugger/constants/Log'
import {RequestTypes} from "../../debugger/constants/RequestTypes";
import {RequestMethods} from "../../debugger/constants/RequestMethods";
import './LogsItem';

const logs: Log[] = [{
	requestId: 0,
	ruleId: 0,
	date: new Date(),
	requestType: RequestTypes.Fetch,
	method: RequestMethods.GET,
	url: 'https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G',
}, {
	requestId: 1,
	ruleId: 0,
	date: new Date(),
	requestType: RequestTypes.Fetch,
	method: RequestMethods.GET,
	url: 'https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G',
}, {
	requestId: 2,
	ruleId: 0,
	date: new Date(),
	requestType: RequestTypes.Fetch,
	method: RequestMethods.GET,
	url: 'https://youtube.com/api/3/videos/streem/webrtc/public/AHWqTUl5Pb92BoXYQ6JhM9q4msaEy2gQqL7STOooj03YT5G',
}];

declare global {
	interface HTMLElementTagNameMap {
		'logs-root': LogsRoot;
	}
}

@customElement('logs-root' as any)
export class LogsRoot extends LitElement {

	@state()
	logs: Log[] = logs;

	protected render() {
		return html`
		<style>
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
			}
			.item:nth-child(odd) {
				background: #2f2f2f;
			}
			#placeholder {
				position: relative;
				top: calc(50% - 8px);
				font-size: 12px;
				text-align: center;
				color: #7E7E7E;
			}
		</style>
		<div id="list">
			${repeat<Log>(this.logs, log => log.requestId, log => (
				html`
				<li class="item">
					<logs-item requestId="${log.requestId}" .log="${log}"></logs-item>
				</li>
				`
			))}
		</div>
		${this.logs.length === 0 ? (
			html`<p id="placeholder">No logs here</p>`
		) : ''}
		`;
	}

	public addLog(log: Log) {
		this.logs = [...this.logs, log];
	}

	public clearLogs() {
		this.logs = [];
	}
}
