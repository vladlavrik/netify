import {Action} from '@/interfaces/rule';
import {RuleActionsType} from '@/constants/RuleActionsType';

export function stringifyActionsSummary(action: Action) {
	const actions = [];

	switch (action.type) {
		case RuleActionsType.Breakpoint:
			if (action.request && action.response) {
				actions.push('Breakpoint on request and response');
			}
			if (action.request) {
				actions.push('Breakpoint on request');
			}
			if (action.response) {
				actions.push('Breakpoint on response');
			}
			break;

		case RuleActionsType.Mutation:
			if (action.request) {
				const {endpoint, method, setHeaders, dropHeaders, body} = action.request;
				if (endpoint) {
					actions.push('Endpoint url replace');
				}
				if (method) {
					actions.push('Request method replace');
				}
				if (setHeaders.length > 0 || dropHeaders.length > 0) {
					actions.push('Request headers mutation');
				}
				if (body) {
					actions.push('Request body replace');
				}
			}
			if (action.response) {
				const {statusCode, setHeaders, dropHeaders, body} = action.response;
				if (statusCode) {
					actions.push('Response status code replace');
				}
				if (setHeaders.length > 0 || dropHeaders.length > 0) {
					actions.push('Response headers mutation');
				}
				if (body) {
					actions.push('Response body replace');
				}
			}
			break;

		case RuleActionsType.LocalResponse:
			actions.push('Local response');
			break;

		case RuleActionsType.Failure:
			actions.push('Failure');
			break;

		case RuleActionsType.Delay:
			actions.push('Delay');
			break;
	}

	return actions.join(', ');
}
