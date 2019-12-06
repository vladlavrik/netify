import {StatusCode} from '@/constants/StatusCode';
import {Rule, RulesSelector, FailureAction, LocalResponseAction, MutationAction} from '@/interfaces/rule';
import {Log} from '@/interfaces/log';
import {Event} from '@/helpers/events';
import {DevtoolsConnector} from '@/services/devtools';
import {ResponseBuilder} from './ResponseBuilder';
import {RequestBuilder} from './RequestBuilder';
import {PausedRequestEventData, PausedResponseEventData, ContinueRequestData, FulfillRequestData, FailRequestData} from './fetchProtocol'; // prettier-ignore

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

		if (!rule || !rule.active) {
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

		switch (rule.action.type) {
			// trigger breakpoint event
			case 'breakpoint':
				// TODO
				break;

			// failure request
			case 'failure':
				this.processRequestFailure(requestId, rule.action);
				break;

			// response locally without sending request to server
			case 'localResponse':
				this.processLocalResponse(requestId, rule.action);
				break;

			// mutate request by the rule and send it to a server
			case 'mutation':
				this.processRequestMutation(requestInput, rule.action);
				break;
		}
	}

	private async processRequestFailure(requestId: string, action: FailureAction) {
		const errorReason = action.reason;
		await this.failRequest({requestId, errorReason});
		this.events.requestEnd.emit(requestId);
	}

	private async processLocalResponse(requestId: string, action: LocalResponseAction) {
		const processor = ResponseBuilder.asLocalResponse(requestId, action);
		const fulfilParams = await processor.build();
		await this.fulfillRequest(fulfilParams);
		this.events.requestEnd.emit(requestId);
	}

	private async processRequestMutation(requestInput: PausedRequestEventData, action: MutationAction) {
		const processor = RequestBuilder.asRequestPatch(requestInput, action);
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

		switch (rule.action.type) {
			case 'breakpoint':
				// TODO;
				break;

			case 'mutation':
				this.processResponseMutation(responseInput, rule.action);
				break;
		}
	}

	private async processResponseMutation(responseInput: PausedResponseEventData, action: MutationAction) {
		const {requestId} = responseInput;
		const {statusCode, headers, body} = action.response;

		const noChanges = statusCode === null && headers.add.length === 0 && headers.remove.length === 0 && !body;

		// TODO comment
		if (noChanges) {
			// TODO describe: not documented but works
			// TODO check is it saves
			await this.continueRequest({requestId});
			this.events.requestEnd.emit(requestId);
			return;
		}

		// TODO comment
		const processor = ResponseBuilder.asResponsePatch(responseInput, action);
		const fulfilParams = await processor.build();
		await this.fulfillRequest(fulfilParams);
		this.events.requestEnd.emit(requestId);
	}

	private selectRule({request: {url, method}, resourceType}: PausedRequestEventData | PausedResponseEventData) {
		return this.rulesSelector.selectOne({url, method, resourceType});
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
