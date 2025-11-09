import {Protocol} from 'devtools-protocol';
import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
import {ResponseErrorReason, responseErrorReasonsList} from '@/constants/ResponseErrorReason';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {StatusCode} from '@/constants/StatusCode';
import {Breakpoint} from '@/interfaces/breakpoint';
import {NetworkLogEntry} from '@/interfaces/networkLog';
import {
	BreakpointRuleAction,
	FailureRuleAction,
	LocalResponseRuleAction,
	MutationRuleAction,
	Rule,
	ScriptRuleAction,
} from '@/interfaces/rule';
import type {DevtoolsConnector} from '@/services/devtools';
import type {Sandbox} from '@/services/sandbox';
import {EventBus} from '@/helpers/EventsBus';
import type {FetchRuleStore} from './FetchRuleStore';
import {
	makeRequestScriptCode,
	makeRequestScriptScope,
	makeResponseScriptCode,
	makeResponseScriptScope,
	RequestScriptResult,
	ResponseScriptResult,
} from './helpers/scripting';
import {RequestBuilder} from './RequestBuilder';
import {ResponseBuilder, ResponsePausedEvent} from './ResponseBuilder';

type EnableRequest = Protocol.Fetch.EnableRequest;
type RequestPausedEvent = Protocol.Fetch.RequestPausedEvent;
type GetResponseBodyResponse = Protocol.Fetch.GetResponseBodyResponse;
type ContinueRequestRequest = Protocol.Fetch.ContinueRequestRequest;
type FulfillRequestRequest = Protocol.Fetch.FulfillRequestRequest;
type FailRequestRequest = Protocol.Fetch.FailRequestRequest;

/**
 * The service provides requests interception by rule filters and:
 * - patching them by the rules
 * - triggering breakpoints and continue them with mutated data
 */
export class FetchDevtools {
	readonly events = {
		requestProcessed: new EventBus<NetworkLogEntry>(),
		requestBreakpoint: new EventBus<Breakpoint>(),
		requestScriptHandleException: new EventBus<{title: string; error: unknown}>(),
	};

	enabled = false;

	private unsubscribeDevtoolsEvents?: () => void;

	constructor(
		private readonly devtools: DevtoolsConnector,
		private readonly rulesStore: FetchRuleStore,
		private readonly sandbox: Sandbox,
	) {}

	async enable() {
		this.log('enabling...');
		this.enabled = true;
		const patterns = this.rulesStore.getRequestPatterns();

		await this.devtools.sendCommand<EnableRequest>('Fetch.enable', {patterns});
		this.unsubscribeDevtoolsEvents = this.devtools.listenEvent<RequestPausedEvent>(
			'Fetch.requestPaused',
			this.process.bind(this),
		);

		this.log('enabled with pattern %o', patterns);
	}

	async disable() {
		this.log('disabling...');
		this.enabled = false;
		if (this.unsubscribeDevtoolsEvents) {
			this.unsubscribeDevtoolsEvents();
		}

		if (this.devtools.status.type === 'connected') {
			await this.devtools.sendCommand('Fetch.disable');
		}
		this.log('disabled');
	}

	private async process(pausedRequest: RequestPausedEvent) {
		const rule = this.rulesStore.selectRules(pausedRequest);
		this.log('intercepted request %o with rule %o', pausedRequest, rule);

		if (!rule || !rule.active) {
			// "continueRequest" can also be used to send a response, not ony request.
			await this.continueRequest({requestId: pausedRequest.requestId});
			return;
		}

		// Ignore failed request
		if (pausedRequest.responseErrorReason !== undefined) {
			await this.continueRequest({requestId: pausedRequest.requestId});
		}

		// Process request or response
		else if (pausedRequest.responseStatusCode === undefined) {
			await this.processRequest(pausedRequest, rule);
		} else {
			await this.processResponse(pausedRequest as ResponsePausedEvent, rule);
		}
	}

	private async processRequest(pausedRequest: RequestPausedEvent, rule: Rule) {
		const {requestId, request, resourceType} = pausedRequest;

		// Report to UI logger about the new handled request
		this.events.requestProcessed.emit({
			requestId,
			interceptStage: 'Request',
			ruleId: rule.id,
			timestamp: Date.now(),
			url: request.url,
			method: request.method as RequestMethod,
			resourceType: resourceType as ResourceType,
		});

		switch (rule.action.type) {
			// Trigger breakpoint event
			case RuleActionsType.Breakpoint:
				await this.triggerRequestBreakpoint(pausedRequest, rule.action);
				break;

			// Response locally without sending request to server
			case RuleActionsType.LocalResponse:
				await this.processLocalResponse(requestId, rule.action);
				break;

			// Mutate request by the rule and send it to a server
			case RuleActionsType.Mutation:
				await this.processRequestMutation(pausedRequest, rule.action);
				break;

			// Failure request
			case RuleActionsType.Failure:
				await this.processRequestFailure(requestId, rule.action);
				break;

			// Script request
			case RuleActionsType.Script:
				await this.processRequestScript(pausedRequest, rule.action);
				break;
		}
	}

	private async processResponse(pausedResponse: ResponsePausedEvent, rule: Rule) {
		switch (rule.action.type) {
			case RuleActionsType.Breakpoint:
				await this.triggerResponseBreakpoint(pausedResponse, rule.action);
				break;

			case RuleActionsType.Mutation:
				await this.processResponseMutation(pausedResponse, rule.action, rule.id);
				break;

			case RuleActionsType.Script:
				await this.processResponseScript(pausedResponse, rule.action);
				break;
		}
	}

	private async triggerRequestBreakpoint(pausedRequest: RequestPausedEvent, action: BreakpointRuleAction) {
		const {requestId} = pausedRequest;
		if (!action.request) {
			await this.continueRequest({requestId});
			return;
		}

		const data = RequestBuilder.compileBreakpoint(pausedRequest);
		this.events.requestBreakpoint.emit({
			stage: 'Request',
			requestId,
			timestamp: Date.now(),
			data,
			continue: async (params) => {
				const builder = RequestBuilder.asBreakpointExecute(requestId, params);
				const continueParams = builder.build();
				return this.continueRequest(continueParams);
			},
			failure: async (errorReason) => {
				return this.failRequest({requestId, errorReason});
			},
		});
	}

	private async triggerResponseBreakpoint(pausedResponse: ResponsePausedEvent, action: BreakpointRuleAction) {
		const {requestId} = pausedResponse;

		if (!action.response) {
			await this.continueRequest({requestId});
			return;
		}

		const {body, base64Encoded} = await this.getResponseBody(pausedResponse.requestId);
		const data = ResponseBuilder.compileBreakpoint(pausedResponse, body, base64Encoded);
		this.events.requestBreakpoint.emit({
			stage: 'Response',
			requestId,
			timestamp: Date.now(),
			data,
			fulfill: async (params) => {
				const builder = ResponseBuilder.asBreakpointExecute(requestId, params);
				const fulfilParams = await builder.build();
				return this.fulfillRequest(fulfilParams);
			},
		});
	}

	private async processRequestFailure(requestId: string, action: FailureRuleAction) {
		const errorReason = action.reason;
		await this.failRequest({requestId, errorReason});
	}

	private async processRequestScript(pausedRequest: RequestPausedEvent, action: ScriptRuleAction) {
		const {requestId} = pausedRequest;

		if (!action.request) {
			await this.continueRequest({requestId});
			return;
		}

		// Prepare executable code and scope
		const scriptScope = makeRequestScriptScope(pausedRequest);
		const code = makeRequestScriptCode(action.request);

		let result;
		try {
			result = await this.sandbox.execute<RequestScriptResult>(code, true, scriptScope);
		} catch (error) {
			console.warn('Fetch devtools: execute request script handler error');
			console.error(error);
			this.events.requestScriptHandleException.emit({title: 'Execute request handling script exception', error});
			await this.continueRequest({requestId});
			return;
		}

		this.log('request script handled with result %o', result);

		switch (result?.type) {
			case 'patch': {
				const builder = RequestBuilder.asScriptResult(requestId, result.patch);
				const continueParams = builder.build();
				await this.continueRequest(continueParams);
				return;
			}
			case 'response': {
				const builder = ResponseBuilder.asScriptResult(pausedRequest, result.response);
				const fulfillParams = await builder.build();
				await this.fulfillRequest(fulfillParams);
				return;
			}
			case 'failure': {
				const reason =
					result.reason && (responseErrorReasonsList as string[]).includes(result.reason)
						? (result.reason as ResponseErrorReason)
						: ResponseErrorReason.Failed;
				await this.failRequest({requestId, errorReason: reason});
				break;
			}
			default:
				await this.continueRequest({requestId});
		}
	}

	private async processResponseScript(pausedResponse: ResponsePausedEvent, action: ScriptRuleAction) {
		const {requestId} = pausedResponse;

		if (!action.response) {
			await this.continueRequest({requestId});
			return;
		}

		// Read the response body
		const body = await this.getResponseBody(pausedResponse.requestId);

		// Prepare executable code and scope
		const scriptScope = makeResponseScriptScope(pausedResponse, body);
		const code = makeResponseScriptCode(action.response);

		let result;
		try {
			result = await this.sandbox.execute<ResponseScriptResult>(code, true, scriptScope);
		} catch (error) {
			console.warn('RESPONSE CODE EXECUTE ERROR');
			console.error(error);
			this.events.requestScriptHandleException.emit({title: 'Execute response handling script exception', error});
			await this.continueRequest({requestId});
			return;
		}

		this.log('response script handled with result %o', result);
		if (result?.type === 'patch') {
			const builder = ResponseBuilder.asScriptResult(pausedResponse, result.patch);
			const fulfillParams = await builder.build();
			await this.fulfillRequest(fulfillParams);
			return;
		}

		await this.continueRequest({requestId});
	}

	private async processLocalResponse(requestId: string, action: LocalResponseRuleAction) {
		const builder = ResponseBuilder.asLocalResponse(requestId, action);
		const fulfilParams = await builder.build();
		if (action.delay) {
			await new Promise((resolve) => setTimeout(resolve, action.delay));
		}
		await this.fulfillRequest(fulfilParams);
	}

	private async processRequestMutation(pausedRequest: RequestPausedEvent, action: MutationRuleAction) {
		const builder = RequestBuilder.asRequestPatch(pausedRequest, action.request);
		const continueParams = builder.build();
		await this.continueRequest(continueParams);
	}

	private async processResponseMutation(
		pausedResponse: ResponsePausedEvent,
		action: MutationRuleAction,
		ruleId: string,
	) {
		const {requestId, request, resourceType} = pausedResponse;
		const {delay, statusCode, setHeaders, dropHeaders, body} = action.response;

		const noChanges = !delay && !statusCode && setHeaders.length === 0 && dropHeaders.length === 0 && !body;

		if (noChanges) {
			// "continueRequest" can also be used to send a response,
			// This method is more appropriate because it does not require the transmission of a read response (headers, body, ..)
			await this.continueRequest({requestId});
			return;
		}

		const mutation = {...action.response};

		// If a body value is not defined by the rule, get an original body, because response body if required to fulfill request
		if (!mutation.body) {
			const {body: value, base64Encoded} = await this.getResponseBody(requestId);
			mutation.body = {
				type: base64Encoded ? ResponseBodyType.Base64 : ResponseBodyType.Text,
				value,
			};
		}

		// Build the response from the original response data and patch from the rule
		const builder = ResponseBuilder.asResponsePatch(pausedResponse, mutation);
		const fulfilParams = await builder.build();

		// Report to UI logger about the new handled response
		// TODO move this to "processResponse"
		this.events.requestProcessed.emit({
			requestId,
			interceptStage: 'Response',
			ruleId,
			timestamp: Date.now(),
			url: request.url,
			method: request.method as RequestMethod,
			resourceType: resourceType as ResourceType,
		});

		// Apply the response delay
		if (delay) {
			await new Promise((resolve) => setTimeout(resolve, delay));
		}

		await this.fulfillRequest(fulfilParams);
	}

	private async getResponseBody(requestId: string) {
		return this.devtools.sendCommand<object, GetResponseBodyResponse>('Fetch.getResponseBody', {requestId});
	}

	/**
	 * Continue request
	 * Can be passed only requestId without other params to continue the request without changes,
	 * in this case it can be used to continue request on response stage too
	 */
	private async continueRequest(params: ContinueRequestRequest) {
		this.log('continue request with params %o', params);
		await this.devtools.sendCommand('Fetch.continueRequest', params);
	}

	private async fulfillRequest(params: FulfillRequestRequest) {
		this.log('fulfill request with params %o', params);

		// Using custom status codes phrase map because build in dictionary is too poor and throws exception when user pass unknown status code
		params.responsePhrase = params.responsePhrase || StatusCode[params.responseCode] || 'UNKNOWN';
		await this.devtools.sendCommand('Fetch.fulfillRequest', params);
	}

	private async failRequest(params: FailRequestRequest) {
		this.log('fail request with params %o', params);
		await this.devtools.sendCommand('Fetch.failRequest', params);
	}

	private log(message: string, ...data: any[]) {
		console.info(`%cFetch devtools: ${message}`, 'color: #3478B1', ...data);
	}
}
