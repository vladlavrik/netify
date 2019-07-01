import {RulesManager} from '@/interfaces/RulesManager';
import {Log} from '@/interfaces/Log';
import {RequestEventParams, CompletedRequestEventParams, ContinueRequestParams} from './chrome/interfaces';
import {RequestProcessor} from './RequestProcessor';
import {ResponseProcessor} from './ResponseProcessor';
import {attachDebugger, detachDebugger, listenDebuggerEvent, listenDebuggerDetach, sendDebuggerCommand, setExtensionIcon} from './chrome/chromeAPI'; // prettier-ignore

// prettier-ignore
const interceptPatterns = [{
	urlPattern: '*',
	interceptionStage: 'Request',
}, {
	urlPattern: '*',
	interceptionStage: 'HeadersReceived',
}];

export enum DebuggerState {
	Active,
	Inactive,
	Starting,
	Stopping,
}

export interface DebuggerConfig {
	tabId: number;
	rulesSelector: RulesManager;
	onRequestStart(data: Log): void; // TODO to listeners.onRequestStart
	onRequestEnd(id: Log['id']): void;
	onUserDetach(): void; // When user manually destroy debugger by Chrome warning-panel
}

export class Debugger {
	private readonly debuggerVersion = '1.3';

	private readonly debugTarget: chrome.debugger.Debuggee & {tabId: number};
	private rulesSelector: RulesManager;
	private readonly listeners: {
		onRequestStart: DebuggerConfig['onRequestStart'];
		onRequestEnd: DebuggerConfig['onRequestEnd'];
		onUserDetach: DebuggerConfig['onUserDetach'];
	};

	private state = DebuggerState.Inactive;

	private requestProcessor: RequestProcessor;
	private responseProcessor: ResponseProcessor;

	get currentState() {
		return this.state;
	}

	constructor({tabId, rulesSelector, onRequestStart, onRequestEnd, onUserDetach}: DebuggerConfig) {
		this.debugTarget = {tabId};
		this.rulesSelector = rulesSelector;
		this.listeners = {onRequestStart, onRequestEnd, onUserDetach};

		this.requestProcessor = new RequestProcessor();
		this.responseProcessor = new ResponseProcessor(this.debugTarget);

		listenDebuggerDetach(this.detachHandler);
	}

	async initialize() {
		this.state = DebuggerState.Starting;

		await attachDebugger(this.debugTarget, this.debuggerVersion);
		await sendDebuggerCommand(this.debugTarget, 'Network.setRequestInterception', {patterns: interceptPatterns});
		listenDebuggerEvent(this.messageHandler);

		this.state = DebuggerState.Active;
		setExtensionIcon(this.debugTarget.tabId, true, 'Netify (active)');
	}

	async destroy() {
		this.state = DebuggerState.Stopping;

		try {
			await detachDebugger(this.debugTarget);
		} catch (error) {
			throw error;
		} finally {
			this.makeInactive();
		}
	}

	private detachHandler = (tabId: number | null) => {
		if (tabId === this.debugTarget.tabId && [DebuggerState.Active, DebuggerState.Starting].includes(this.state)) {
			this.makeInactive();
			this.listeners.onUserDetach();
		}
	};

	private makeInactive() {
		this.state = DebuggerState.Inactive;
		setExtensionIcon(this.debugTarget.tabId, false, 'Netify (inactive)');
	}

	private messageHandler = async (_source: any, method: string, params: any) => {
		if (method === 'Network.requestIntercepted') {
			await this.handleInterceptedRequest(params);
		}
	};

	private async handleInterceptedRequest(interceptEvent: RequestEventParams | CompletedRequestEventParams) {
		const {interceptionId, request, resourceType} = interceptEvent;
		const rule = this.rulesSelector.selectOne({...request, resourceType});

		// skip if none rule for the request
		if (!rule) {
			await this.continueIntercepted({interceptionId});
			return;
		}

		let patchedRequest: ContinueRequestParams;
		if (!interceptEvent.hasOwnProperty('responseStatusCode')) {
			// request stage

			// notify about new request
			this.listeners.onRequestStart({
				id: interceptionId,
				ruleId: rule.id,
				loaded: false,
				date: new Date(),
				url: request.url,
				method: request.method,
				resourceType: request.resourceType,
			});

			patchedRequest = await this.requestProcessor.process(interceptEvent, rule);

			// if there is a local response or cancel reason - notify about the request end
			if (patchedRequest.errorReason || patchedRequest.rawResponse) {
				this.listeners.onRequestEnd(interceptionId);
			}
		} else {
			// response stage
			patchedRequest = await this.responseProcessor.process(interceptEvent as CompletedRequestEventParams, rule);
			this.listeners.onRequestEnd(interceptionId);
		}

		await this.continueIntercepted(patchedRequest);
	}

	private async continueIntercepted(params: ContinueRequestParams, waitTime?: number) {
		const continueCommand = async () => {
			return sendDebuggerCommand(this.debugTarget, 'Network.continueInterceptedRequest', params);
		};

		if (waitTime) {
			// TODO implement throttling
		} else {
			await continueCommand();
		}
	}
}
