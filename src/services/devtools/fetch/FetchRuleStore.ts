import {Protocol} from 'devtools-protocol';
import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {Rule} from '@/interfaces/Rule';

type RequestStage = Protocol.Fetch.RequestStage;
type RequestPattern = Protocol.Fetch.RequestPattern;
type RequestPausedEvent = Protocol.Fetch.RequestPausedEvent;

export class FetchRuleStore {
	private static transformUrlPatterToRegexp(pattern: string) {
		const regexpStr = pattern
			.replace(/\?/g, '.') // ? wildcards pattern
			.replace(/\*/g, '.*?'); // * Wildcards pattern

		return new RegExp(`^${regexpStr}$`);
	}

	private currentOrigin = '';
	private rulesList: Rule[] = [];

	setCurrentOrigin(newOrigin: string) {
		this.currentOrigin = newOrigin;
	}

	setRulesList(newRulesList: Rule[]) {
		this.rulesList = newRulesList;
	}

	reset() {
		this.currentOrigin = '';
		this.rulesList = [];
	}

	getRequestPatterns() {
		const patterns: RequestPattern[] = [];

		for (const {active, filter, action} of this.rulesList) {
			if (!active) {
				continue;
			}

			const stages: RequestStage[] = [];

			switch (action.type) {
				case RuleActionsType.Breakpoint:
					if (action.request) {
						stages.push('Request');
					}
					if (action.response) {
						stages.push('Response');
					}
					break;

				case RuleActionsType.Mutation: {
					const {request, response} = action;
					const hasRequestMutation =
						!!request.endpoint ||
						!!request.method ||
						request.setHeaders.length > 0 ||
						request.dropHeaders.length > 0 ||
						!!request.body;

					const hasResponseMutation =
						!!response.delay ||
						!!response.statusCode ||
						response.setHeaders.length > 0 ||
						response.dropHeaders.length > 0 ||
						!!response.body;

					if (hasRequestMutation) {
						stages.push('Request');
					}
					if (hasResponseMutation) {
						stages.push('Response');
					}

					break;
				}

				case RuleActionsType.LocalResponse:
				case RuleActionsType.Failure:
					stages.push('Request');
					break;

				case RuleActionsType.Script:
					if (action.request) {
						stages.push('Request');
					}
					if (action.response) {
						stages.push('Response');
					}
					break;
			}

			const urlPattern = filter.url.startsWith('/')
				? // If the url starts with the slash char - url related to the current tab origin
				  this.currentOrigin + filter.url
				: filter.url || '*';

			for (const requestStage of stages) {
				if (filter.resourceTypes.length === 0) {
					patterns.push({urlPattern, requestStage});
					continue;
				}

				for (const resourceType of filter.resourceTypes) {
					patterns.push({urlPattern, resourceType, requestStage});
				}
			}
		}

		return patterns;
	}

	selectRules(select: RequestPausedEvent): Rule | undefined {
		const requestUrl = select.request.url;
		const requestMethod = select.request.method as RequestMethod;
		const requestResourceType = select.resourceType as ResourceType;

		return this.rulesList.find(({active, filter}) => {
			if (!active) {
				return false;
			}

			if (filter.url) {
				const requestUrlOrigin = requestUrl
					.split('/')
					.slice(0, 3) // First double slash is the end of schema, third slash is the path part start
					.join('/');

				const fullFilterUrl = filter.url.startsWith('/') // It mean schema and host is not defined
					? requestUrlOrigin + filter.url
					: filter.url;

				const urlRegexp = FetchRuleStore.transformUrlPatterToRegexp(fullFilterUrl);
				if (!urlRegexp.test(requestUrl)) {
					return false;
				}
			}

			if (filter.resourceTypes.length && !filter.resourceTypes.includes(requestResourceType)) {
				return false;
			}

			if (filter.methods.length && !filter.methods.includes(requestMethod)) {
				// TODO FIXME: when the rule has filter by a method and the rule's action changes the request method,
				//  - the response will not be handled
				return false;
			}

			return true;
		});
	}
}
