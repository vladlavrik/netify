import {StatusCode} from '@/constants/StatusCode';
import {PausedRequest, PausedResponse} from '@/interfaces/request';
import {Rule, RulesSelector} from '@/interfaces/rule';
import {Log} from '@/interfaces/log';
import {sendDebuggerCommand} from './chrome/devtoolsAPI';
import {PausedRequestEventData, PausedResponseEventData, GetResponseBodyResult, ContinueRequestData, FulfillRequestData, FailRequestData} from './chrome/devtoolsProtocol'; // prettier-ignore
import {ResponseProcessor} from './ResponseProcessor';
import {RequestProcessor} from './RequestProcessor';

// TODO use live pattern
// prettier-ignore
const requestPatterns = [{
	urlPattern: '*',
	requestStage: 'Request',
}, {
	urlPattern: '*',
	requestStage: 'Response',
}];

export interface FetchDomainConfig {
	tabId: number;
	rulesSelector: RulesSelector;
	onRequestStart(data: Log): void;
	onRequestEnd(id: string): void;
	onRequestBreakpoint(request: PausedRequest): PausedRequest;
	onResponseBreakpoint(response: PausedResponse): PausedResponse;
}

export class FetchDomain {
	private readonly debugTarget: chrome.debugger.Debuggee & {tabId: number};

	private rulesSelector: RulesSelector;

	private readonly listeners: {
		onRequestStart: FetchDomainConfig['onRequestStart'];
		onRequestEnd: FetchDomainConfig['onRequestEnd'];
		onRequestBreakpoint: FetchDomainConfig['onRequestBreakpoint'];
		onResponseBreakpoint: FetchDomainConfig['onResponseBreakpoint'];
	};

	constructor(config: FetchDomainConfig) {
		const {tabId, rulesSelector, onRequestEnd, onRequestStart, onRequestBreakpoint, onResponseBreakpoint} = config;
		this.debugTarget = {tabId};
		this.rulesSelector = rulesSelector;
		this.listeners = {onRequestStart, onRequestEnd, onRequestBreakpoint, onResponseBreakpoint};
	}

	async enable() {
		await sendDebuggerCommand(this.debugTarget, 'Fetch.enable', {patterns: requestPatterns});
	}

	async disable() {
		await sendDebuggerCommand(this.debugTarget, 'Fetch.disable');
	}

	async process(pausedFetch: PausedRequestEventData | PausedResponseEventData) {
		// Select a rule
		const rule = this.selectRule(pausedFetch);

		if (!pausedFetch.hasOwnProperty('responseStatusCode')) {
			await this.processRequest(pausedFetch as PausedRequestEventData, rule);
		} else {
			await this.processResponse(pausedFetch as PausedResponseEventData, rule);
		}
	}

	private async processRequest(requestInput: PausedRequestEventData, rule: Rule | null) {
		const {requestId, request} = requestInput;

		if (!rule) {
			await this.continueRequest({requestId});
			return;
		}

		// Notify about new request
		this.listeners.onRequestStart({
			id: requestId,
			ruleId: rule.id,
			loaded: false,
			date: new Date(),
			url: request.url,
			method: request.method,
			resourceType: request.resourceType,
		});

		const {breakpoint, mutate, cancel} = rule.actions;

		//  Todo comment me
		if (breakpoint.request) {
			this.triggerRequestBreakpoint(requestInput);
			return;
		}

		// If response error is defined and local response is required - return the error reason on the request stage
		if (cancel.enabled) {
			const errorReason = cancel.reason;
			await this.failRequest({requestId, errorReason});
			return;
		}

		// If required local response, combine the response form defined int the rule status, headers and body
		if (mutate.response.enabled && mutate.response.responseLocally) {
			const processor = ResponseProcessor.asLocalResponse(requestId, rule);
			const fulfilParams = await processor.build();
			await this.fulfillRequest(fulfilParams);
			return;
		}

		// Todo comment me
		const processor = RequestProcessor.asRequestPatch(requestInput, rule);
		const continueParams = processor.build();
		await this.continueRequest(continueParams);
	}

	private async processResponse(responseInput: PausedResponseEventData, rule: Rule | null) {
		const {requestId} = responseInput;

		// Skip ----- todo comment
		if (!rule) {
			// TODO describe: not documented but works
			await this.continueRequest({requestId});
			return;
		}

		const {breakpoint, mutate} = rule.actions;

		// TODO comment
		if (breakpoint.response) {
			await this.triggerResponseBreakpoint(responseInput);
			return;
		}

		const skipHandler = // TODO check it
			mutate.response.statusCode === null &&
			mutate.response.headers.add.length === 0 &&
			mutate.response.headers.remove.length === 0 &&
			!mutate.response.body.type;

		// TODO comment
		if (skipHandler) {
			// TODO describe: not documented but works
			await this.continueRequest({requestId});
			return;
		}

		// TODO comment
		const processor = ResponseProcessor.asResponsePatch(responseInput, rule);
		const fulfilParams = await processor.build();
		await this.fulfillRequest(fulfilParams);
	}

	private selectRule({request: {url, method}, resourceType}: PausedRequestEventData | PausedResponseEventData) {
		return this.rulesSelector.selectOne({url, method, resourceType});
	}

	private triggerRequestBreakpoint(requestData: PausedRequestEventData) {
		const compiledData = RequestProcessor.compilePausedRequest(requestData);
		this.listeners.onRequestBreakpoint(compiledData);
	}

	private async triggerResponseBreakpoint(responseData: PausedResponseEventData) {
		const {body, base64Encoded} = await this.getResponseBody(responseData.requestId);
		const compiledData = ResponseProcessor.compilePausedResponse(responseData, body, base64Encoded);
		this.listeners.onResponseBreakpoint(compiledData);
	}

	async executeRequestBreakpoint(request: PausedRequest) {
		const processor = RequestProcessor.asBreakpointExecute(request);
		const continueParams = processor.build();
		await this.continueRequest(continueParams);
	}

	async executeResponseBreakpoint(response: PausedResponse) {
		const processor = ResponseProcessor.asBreakpointExecute(response);
		const fulfilParams = await processor.build();
		await this.fulfillRequest(fulfilParams);
	}

	private async getResponseBody(requestId: string) {
		return await sendDebuggerCommand<{requestId: string}, GetResponseBodyResult>(
			this.debugTarget,
			'Fetch.getResponseBody',
			{requestId},
		);
	}

	private continueRequest(params: ContinueRequestData) {
		return sendDebuggerCommand<ContinueRequestData>(this.debugTarget, 'Fetch.continueRequest', params);
	}

	private fulfillRequest(params: FulfillRequestData) {
		params.responsePhrase = params.responsePhrase || StatusCode[params.responseCode] || 'UNKNOWN';
		return sendDebuggerCommand<FulfillRequestData>(this.debugTarget, 'Fetch.continueRequest', params);
	}

	private failRequest(params: FailRequestData) {
		return sendDebuggerCommand<FailRequestData>(this.debugTarget, 'Fetch.failRequest', params);
	}
}
