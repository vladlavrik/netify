import {Protocol} from 'devtools-protocol';
import {Rule} from '@/interfaces/Rule';
import {ActionsType} from '@/constants/ActionsType';
import {ResourceType} from '@/constants/ResourceType';
import {RequestMethod} from '@/constants/RequestMethod';
import {Event} from '@/helpers/Events';

type RequestStage = Protocol.Fetch.RequestStage;
type RequestPattern = Protocol.Fetch.RequestPattern;
type RequestPausedEvent = Protocol.Fetch.RequestPausedEvent;

export class FetchRuleStore {
	private static transformUrlPatterToRegexp(pattern: string) {
		const regexpStr = pattern
			.replace(/\?/g, '.') // ? wildcards pattern
			.replace(/\*/g, '.*?'); // * wildcards pattern

		return new RegExp(`^${regexpStr}$`);
	}

	readonly rulesChanged = new Event();

	private rulesList: Rule[] = [];

	setRulesList(newRulesList: Rule[]) {
		this.rulesList = newRulesList;
		this.rulesChanged.emit();
	}

	getRequestPatterns() {
		const patterns: RequestPattern[] = [];

		for (const {active, filter, action} of this.rulesList) {
			if (!active) {
				continue;
			}

			const stages: RequestStage[] = [];

			switch (action.type) {
				case ActionsType.Breakpoint:
					if (action.request) {
						stages.push('Request');
					}
					if (action.response) {
						stages.push('Response');
					}
					break;

				case ActionsType.Mutation:
					const {request, response} = action;
					const hasRequestMutation =
						!!request.endpoint ||
						!!request.method ||
						request.setHeaders.length > 0 ||
						request.dropHeaders.length > 0 ||
						!!request.body;

					const hasResponseMutation =
						!!response.statusCode ||
						request.setHeaders.length > 0 ||
						request.dropHeaders.length > 0 ||
						!!request.body;

					if (hasRequestMutation) {
						stages.push('Request');
					}
					if (hasResponseMutation) {
						stages.push('Response');
					}

					break;

				case ActionsType.LocalResponse:
				case ActionsType.Failure:
					stages.push('Request');
					break;
			}

			const urlPattern = filter.url.startsWith('/')
				? `*${filter.url}` // "*" instead protocol/host
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

		console.log(patterns);
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

				const fullFilterUrl = filter.url.startsWith('/') // it mean schema and host is not defined
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
				return false;
			}

			return true;
		});
	}
}
