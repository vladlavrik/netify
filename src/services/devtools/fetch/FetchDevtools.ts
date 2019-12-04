import {StatusCode} from '@/constants/StatusCode';
import {CancelReasons} from '@/constants/CancelReasons';
import {RequestBreakpoint, ResponseBreakpoint} from '@/interfaces/breakpoint';
import {Rule, RulesSelector} from '@/interfaces/rule';
import {Log} from '@/interfaces/log';
import {Event} from '@/helpers/events';
import {DevtoolsConnector} from '@/services/devtools';
import {PausedRequestEventData, PausedResponseEventData, GetResponseBodyResult, ContinueRequestData, FulfillRequestData, FailRequestData} from './fetchProtocol'; // prettier-ignore
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

type PausedRequestOrResponseEvent = PausedRequestEventData | PausedResponseEventData;
export class FetchDevtools {
	readonly events = {
		requestStart: new Event<Log>(),
		requestEnd: new Event<string /* unique request id*/>(),
		requestBreakpoint: new Event<RequestBreakpoint>(),
		responseBreakpoint: new Event<ResponseBreakpoint>(),
	};

	private unsubscribeDevtoolsEvents?: () => void;

	constructor(private readonly rulesSelector: RulesSelector, private readonly devtools: DevtoolsConnector) {}

	async enable() {
		await this.devtools.sendCommand('Fetch.enable', {patterns: requestPatterns});
		this.unsubscribeDevtoolsEvents = await this.devtools.listenEvent<PausedRequestOrResponseEvent>(
			'Fetch.requestPaused',
			this.process.bind(this),
		);
	}

	async disable() {
		if (this.devtools.isAttached) {
			await this.devtools.sendCommand('Fetch.disable');
		}
		if (this.unsubscribeDevtoolsEvents) {
			this.unsubscribeDevtoolsEvents();
		}
	}

	private async process(pausedFetch: PausedRequestEventData | PausedResponseEventData) {
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

		// notify about new request
		this.events.requestStart.emit({
			id: requestId,
			ruleId: rule.id,
			loaded: false,
			date: new Date(),
			url: request.url,
			method: request.method,
			resourceType: request.resourceType,
		});

		const {breakpoint, mutate, cancel} = rule.actions;

		// trigger breakpoint event
		if (breakpoint.request) {
			this.triggerRequestBreakpoint(requestInput);
			return;
		}

		// if response error is defined and local response is required - return the error reason on the request stage
		if (cancel.enabled) {
			const errorReason = cancel.reason;
			await this.failRequest({requestId, errorReason});
			this.events.requestEnd.emit(requestId);
			return;
		}

		// if required local response, combine the response form defined in the rule status, headers and body
		if (mutate.response.enabled && mutate.response.responseLocally) {
			const processor = ResponseProcessor.asLocalResponse(requestId, rule);
			const fulfilParams = await processor.build();
			await this.fulfillRequest(fulfilParams);
			this.events.requestEnd.emit(requestId);
			return;
		}

		// otherwise mutate request by the rule and send it to a server
		const processor = RequestProcessor.asRequestPatch(requestInput, rule);
		const continueParams = processor.build();
		await this.continueRequest(continueParams);
	}

	private async processResponse(responseInput: PausedResponseEventData, rule: Rule | null) {
		const {requestId} = responseInput;

		// skip ----- todo comment
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
			// TODO check is it saves
			await this.continueRequest({requestId});
			this.events.requestEnd.emit(requestId);
			return;
		}

		// TODO comment
		const processor = ResponseProcessor.asResponsePatch(responseInput, rule);
		const fulfilParams = await processor.build();
		await this.fulfillRequest(fulfilParams);
		this.events.requestEnd.emit(requestId);
	}

	private selectRule({request: {url, method}, resourceType}: PausedRequestEventData | PausedResponseEventData) {
		return this.rulesSelector.selectOne({url, method, resourceType});
	}

	private triggerRequestBreakpoint(requestData: PausedRequestEventData) {
		const breakpoint = RequestProcessor.compileBreakpoint(requestData);
		this.events.requestBreakpoint.emit(breakpoint);
	}

	private async triggerResponseBreakpoint(responseData: PausedResponseEventData) {
		await this.getResponseBody(responseData.requestId);
		const {body, base64Encoded} = await this.getResponseBody(responseData.requestId);
		const breakpoint = ResponseProcessor.compileBreakpoint(responseData, body, base64Encoded);
		this.events.responseBreakpoint.emit(breakpoint);
	}

	async executeRequestBreakpoint(request: RequestBreakpoint) {
		const processor = RequestProcessor.asBreakpointExecute(request);
		const continueParams = processor.build();
		await this.continueRequest(continueParams);
	}

	async executeResponseBreakpoint(response: ResponseBreakpoint) {
		const processor = ResponseProcessor.asBreakpointExecute(response);
		const fulfilParams = await processor.build();
		await this.fulfillRequest(fulfilParams);
		this.events.requestEnd.emit(response.requestId);
	}

	async abortBreakpoint(requestId: string) {
		const errorReason = CancelReasons.Aborted;
		await this.failRequest({requestId, errorReason});
		this.events.requestEnd.emit(requestId);
	}

	private async getResponseBody(requestId: string) {
		return await this.devtools.sendCommand<{}, GetResponseBodyResult>('Fetch.getResponseBody', {requestId});
	}

	private async continueRequest(params: ContinueRequestData) {
		console.log(params);
		await this.devtools.sendCommand('Fetch.continueRequest', params);
	}

	private async fulfillRequest(params: FulfillRequestData) {
		params.responsePhrase = params.responsePhrase || StatusCode[params.responseCode] || 'UNKNOWN';
		await this.devtools.sendCommand('Fetch.fulfillRequest', params);
	}

	private async failRequest(params: FailRequestData) {
		await this.devtools.sendCommand('Fetch.failRequest', params);
	}
}
