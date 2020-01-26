import {Protocol} from 'devtools-protocol';
import {Rule, MutationAction, LocalResponseAction, FailureAction} from '@/interfaces/rule';
import {Log} from '@/interfaces/log';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';
import {StatusCode} from '@/constants/StatusCode';
import {Event} from '@/helpers/Events';
import {DevtoolsConnector} from '@/services/devtools';
import {ResponseBuilder} from './ResponseBuilder';
import {RequestBuilder} from './RequestBuilder';
import {FetchRuleStore} from './FetchRuleStore';

type EnableRequest = Protocol.Fetch.EnableRequest;
type RequestPausedEvent = Protocol.Fetch.RequestPausedEvent;
type ContinueRequestRequest = Protocol.Fetch.ContinueRequestRequest;
type FulfillRequestRequest = Protocol.Fetch.FulfillRequestRequest;
type FailRequestRequest = Protocol.Fetch.FailRequestRequest;

/**
 * The service provides requests interception by rule filters and:
 * - patching they by the rules
 * - triggering breakpoints and continue them with a mutated data
 */
export class FetchDevtools {
	readonly events = {
		requestProcessed: new Event<Log>(),
	};

	private enabled = false;
	private unsubscribeDevtoolsEvents?: () => void;

	constructor(private readonly devtools: DevtoolsConnector, private readonly rulesStore: FetchRuleStore) {}

	async enable() {
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
		this.enabled = false;

		if (this.devtools.isAttached) {
			await this.devtools.sendCommand('Fetch.disable');
		}
		if (this.unsubscribeDevtoolsEvents) {
			this.unsubscribeDevtoolsEvents();
		}

		this.log('disabled');
	}

	async restart() {
		if (this.enabled) {
			await this.disable();
			await this.enable();
		}
	}

	private async process(pausedRequest: RequestPausedEvent) {
		const rule = this.rulesStore.selectRules(pausedRequest);
		this.log('intercepted request %o with rule %o', pausedRequest, rule);

		if (!rule || !rule.active) {
			// "continueRequest" can also be used to send a response, not ony request.
			await this.continueRequest({requestId: pausedRequest.requestId});
			return;
		}

		if (!pausedRequest.hasOwnProperty('responseStatusCode')) {
			await this.processRequest(pausedRequest, rule);
		} else {
			await this.processResponse(pausedRequest, rule);
		}
	}

	private async processRequest(pausedRequest: RequestPausedEvent, rule: Rule) {
		const {requestId, request, resourceType} = pausedRequest;

		switch (rule.action.type) {
			// Trigger breakpoint event
			case RuleActionsType.Breakpoint:
				// TODO FUTURE
				break;

			// Response locally without sending request to server
			case RuleActionsType.LocalResponse:
				this.processLocalResponse(requestId, rule.action);
				break;

			// Mutate request by the rule and send it to a server
			case RuleActionsType.Mutation:
				this.processRequestMutation(pausedRequest, rule.action);
				break;

			// Failure request
			case RuleActionsType.Failure:
				this.processRequestFailure(requestId, rule.action);
				break;
		}

		// Report to UI logger about the new handled request
		this.events.requestProcessed.emit({
			requestId,
			interceptStage: 'Request',
			ruleId: rule.id,
			date: new Date(),
			url: request.url,
			method: request.method as RequestMethod,
			resourceType: resourceType as ResourceType,
		});
	}

	private async processRequestFailure(requestId: string, action: FailureAction) {
		const errorReason = action.reason;
		await this.failRequest({requestId, errorReason});
	}

	private async processLocalResponse(requestId: string, action: LocalResponseAction) {
		const builder = ResponseBuilder.asLocalResponse(requestId, action);
		const fulfilParams = await builder.build();
		await this.fulfillRequest(fulfilParams);
	}

	private async processRequestMutation(pausedRequest: RequestPausedEvent, action: MutationAction) {
		const builder = RequestBuilder.asRequestPatch(pausedRequest, action);
		const continueParams = builder.build();
		await this.continueRequest(continueParams);
	}

	private async processResponse(pausedRequest: RequestPausedEvent, rule: Rule) {
		switch (rule.action.type) {
			case RuleActionsType.Breakpoint:
				// TODO FUTURE
				break;

			case RuleActionsType.Mutation:
				this.processResponseMutation(pausedRequest, rule.action, rule.id);
				break;
		}
	}

	private async processResponseMutation(pausedRequest: RequestPausedEvent, action: MutationAction, ruleId: string) {
		const {requestId, request, resourceType} = pausedRequest;
		const {statusCode, setHeaders, dropHeaders, body} = action.response;

		const noChanges = !statusCode && setHeaders.length === 0 && dropHeaders.length === 0 && !body;

		if (noChanges) {
			// "continueRequest" can also be used to send a response,
			// This method is more appropriate because it does not require the transmission of a read response (headers, body, ..)
			await this.continueRequest({requestId});
			return;
		}

		// Build the response from the original response data and patch from the rule
		const builder = ResponseBuilder.asResponsePatch(pausedRequest, action);
		const fulfilParams = await builder.build();
		await this.fulfillRequest(fulfilParams);

		// Report to UI logger about the new handled response
		this.events.requestProcessed.emit({
			requestId,
			interceptStage: 'Response',
			ruleId,
			date: new Date(),
			url: request.url,
			method: request.method as RequestMethod,
			resourceType: resourceType as ResourceType,
		});
	}

	private async continueRequest(params: ContinueRequestRequest) {
		this.log('continue request with params %o', params);
		await this.devtools.sendCommand('Fetch.continueRequest', params);
	}

	private async fulfillRequest(params: FulfillRequestRequest) {
		this.log('fulfill request with params %o', params);

		// Using custom status codes phrase map because build  in dictionary is too poor and throws exception when user pass unknown status code
		params.responsePhrase = params.responsePhrase || StatusCode[params.responseCode] || 'UNKNOWN';
		await this.devtools.sendCommand('Fetch.fulfillRequest', params);
	}

	private async failRequest(params: FailRequestRequest) {
		this.log('fail request with params %o', params);
		await this.devtools.sendCommand('Fetch.failRequest', params);
	}

	private log(message: string, ...data: any[]) {
		if (process.env.NODE_ENV === 'development') {
			console.info(`%cFetch devtools: ${message}`, 'color: #3478B1', ...data);
		}
	}
}
