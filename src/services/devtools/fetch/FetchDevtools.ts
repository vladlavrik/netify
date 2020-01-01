import {Protocol} from 'devtools-protocol';
import {FailureAction, LocalResponseAction, MutationAction, Rule} from '@/interfaces/rule';
import {Log} from '@/interfaces/log';
import {ActionsType} from '@/constants/ActionsType';
import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';
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

export class FetchDevtools {
	readonly events = {
		requestStart: new Event<Log>(),
		requestEnd: new Event<string /* Unique request id*/>(),
	};

	private enabled = false;
	private unsubscribeDevtoolsEvents?: () => void;

	constructor(private readonly devtools: DevtoolsConnector, private readonly rulesStore: FetchRuleStore) {
		rulesStore.rulesChanged.on(this.restart.bind(this));
	}

	async enable() {
		this.enabled = true;

		const patterns = this.rulesStore.getRequestPatterns();
		await this.devtools.sendCommand<EnableRequest>('Fetch.enable', {patterns});

		this.unsubscribeDevtoolsEvents = await this.devtools.listenEvent<RequestPausedEvent>(
			'Fetch.requestPaused',
			this.process.bind(this),
		);
	}

	async disable() {
		this.enabled = false;

		if (this.devtools.isAttached) {
			await this.devtools.sendCommand('Fetch.disable');
		}
		if (this.unsubscribeDevtoolsEvents) {
			this.unsubscribeDevtoolsEvents();
		}
	}

	async restart() {
		if (this.enabled) {
			await this.disable();
			await this.enable();
		}
	}

	private async process(pausedRequest: RequestPausedEvent) {
		const rule = this.rulesStore.selectRules(pausedRequest);
		console.log('pausedRequest', pausedRequest, rule);

		if (!rule || !rule.active) {
			// TODO describe: not documented but works
			// TODO check is it works now
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

		if (!rule || !rule.active) {
			await this.continueRequest({requestId});
			return;
		}

		// Notify about new request
		this.events.requestStart.emit({
			id: requestId,
			ruleId: rule.id,
			loaded: false,
			date: new Date(),
			url: request.url,
			method: request.method as RequestMethod,
			resourceType: resourceType as ResourceType,
		});

		switch (rule.action.type) {
			// Trigger breakpoint event
			case ActionsType.Breakpoint:
				// TODO
				break;

			// Response locally without sending request to server
			case ActionsType.LocalResponse:
				this.processLocalResponse(requestId, rule.action);
				break;

			// Mutate request by the rule and send it to a server
			case ActionsType.Mutation:
				this.processRequestMutation(pausedRequest, rule.action);
				break;

			// Failure request
			case ActionsType.Failure:
				this.processRequestFailure(requestId, rule.action);
				break;
		}
	}

	private async processRequestFailure(requestId: string, action: FailureAction) {
		const errorReason = action.reason;
		await this.failRequest({requestId, errorReason});
		this.events.requestEnd.emit(requestId);
	}

	private async processLocalResponse(requestId: string, action: LocalResponseAction) {
		const builder = ResponseBuilder.asLocalResponse(requestId, action);
		const fulfilParams = await builder.build();
		await this.fulfillRequest(fulfilParams);
		this.events.requestEnd.emit(requestId);
	}

	private async processRequestMutation(pausedRequest: RequestPausedEvent, action: MutationAction) {
		const builder = RequestBuilder.asRequestPatch(pausedRequest, action);
		const continueParams = builder.build();
		await this.continueRequest(continueParams);
	}

	private async processResponse(pausedRequest: RequestPausedEvent, rule: Rule) {
		switch (rule.action.type) {
			case ActionsType.Breakpoint:
				// TODO;
				break;

			case ActionsType.Mutation:
				this.processResponseMutation(pausedRequest, rule.action);
				break;
		}
	}

	private async processResponseMutation(pausedRequest: RequestPausedEvent, action: MutationAction) {
		const {requestId} = pausedRequest;
		const {statusCode, setHeaders, dropHeaders, body} = action.response;

		const noChanges = !statusCode && setHeaders.length === 0 && dropHeaders.length === 0 && !body;

		// TODO comment
		if (noChanges) {
			// TODO describe: not documented but works
			// TODO check is it saves
			await this.continueRequest({requestId});
			this.events.requestEnd.emit(requestId);
			return;
		}

		// TODO comment
		const builder = ResponseBuilder.asResponsePatch(pausedRequest, action);
		const fulfilParams = await builder.build();
		await this.fulfillRequest(fulfilParams);
		this.events.requestEnd.emit(requestId);
	}

	private async continueRequest(params: ContinueRequestRequest) {
		console.log('continueRequest', params);
		await this.devtools.sendCommand('Fetch.continueRequest', params);
	}

	private async fulfillRequest(params: FulfillRequestRequest) {
		console.log('fulfillRequest', params);
		await this.devtools.sendCommand('Fetch.fulfillRequest', params);
	}

	private async failRequest(params: FailRequestRequest) {
		await this.devtools.sendCommand('Fetch.failRequest', params);
	}
}
