import {RuleActionsType} from '@/constants/RuleActionsType';
import {RuleAction} from '@/interfaces/rule';

export function stringifyActionsSummary(action: RuleAction) {
	const actions = [];

	switch (action.type) {
		case RuleActionsType.Breakpoint:
			if (action.request && action.response) {
				actions.push('Breakpoint on request and response');
			} else if (action.request) {
				actions.push('Breakpoint on request');
			} else if (action.response) {
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
				const {delay, statusCode, setHeaders, dropHeaders, body} = action.response;
				if (delay) {
					actions.push('Response delay');
				}
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

		case RuleActionsType.Script: {
			const {request, response} = action;
			if (request && response) {
				actions.push('Request and reponse handler script');
			} else if (request) {
				actions.push('Request handler script');
			} else if (response) {
				actions.push('response handler script');
			}
			break;
		}
	}

	return actions.join(', ');
}
