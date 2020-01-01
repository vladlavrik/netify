import {HeadersArray} from '@/interfaces/headers';
import {RequestBody, ResponseBody} from '@/interfaces/body';
import {Action, BreakpointAction, FailureAction, LocalResponseAction, MutationAction, Rule} from '@/interfaces/Rule';
import {ActionsType} from '@/constants/ActionsType';
import {BreakpointStage} from '@/constants/BreakpointStage';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
import {RequestBodyType} from '@/constants/RequestBodyType';
import {RuleFormSchema, RequestBodySchema, ResponseBodySchema} from './ruleFormSchema';

function deserializeRequestBody({type, textValue, formValue}: RequestBodySchema): RequestBody | undefined {
	switch (type) {
		case 'Original':
			return undefined;

		case RequestBodyType.Text:
			return {
				type,
				value: textValue,
			};

		case RequestBodyType.UrlEncodedForm:
		case RequestBodyType.MultipartFromData:
			return {
				type,
				value: formValue.map(({key, value}) => ({key: key.trim(), value})).filter(({key}) => !!key),
			};
	}
}

function deserializeResponseBody({type, textValue, fileValue}: ResponseBodySchema): ResponseBody | undefined {
	switch (type) {
		case 'Original':
			return undefined;

		case ResponseBodyType.Text:
		case ResponseBodyType.Base64:
			return {
				type,
				value: textValue,
			};

		case ResponseBodyType.File:
			return {
				type,
				value: fileValue,
			};
	}
}

function deserializeSetHeaders(headers: HeadersArray) {
	return headers
		.map(({name, value}) => ({
			name: name.trim(),
			value: value.trim(),
		}))
		.filter(({name}) => !!name);
}

function deserializeDropHeaders(headers: string[]) {
	return headers.map(name => name.trim()).filter(name => !!name);
}

export function deserializeRuleForm(form: RuleFormSchema, id: string, active: boolean): Rule {
	const {filter, actionType, actionConfigs} = form;

	let action: Action;

	switch (actionType) {
		case ActionsType.Breakpoint: {
			const {stage} = actionConfigs[ActionsType.Breakpoint];
			action = {
				type: ActionsType.Breakpoint,
				request: [BreakpointStage.Both, BreakpointStage.Request].includes(stage),
				response: [BreakpointStage.Both, BreakpointStage.Response].includes(stage),
			} as BreakpointAction;
			break;
		}

		case ActionsType.Mutation: {
			const {request, response} = actionConfigs[ActionsType.Mutation];
			action = {
				type: ActionsType.Mutation,
				request: {
					endpoint: request.endpoint || undefined,
					method: request.method,
					setHeaders: deserializeSetHeaders(request.setHeaders),
					dropHeaders: deserializeDropHeaders(request.dropHeaders),
					body: deserializeRequestBody(request.body),
				},
				response: {
					statusCode: response.statusCode,
					setHeaders: deserializeSetHeaders(response.setHeaders),
					dropHeaders: deserializeDropHeaders(response.dropHeaders),
					body: deserializeResponseBody(response.body),
				},
			} as MutationAction;
			break;
		}

		case ActionsType.LocalResponse: {
			const {statusCode, headers, body} = actionConfigs[ActionsType.LocalResponse];

			action = {
				type: ActionsType.LocalResponse,
				statusCode,
				headers: deserializeSetHeaders(headers),
				body: deserializeResponseBody(body)!,
			} as LocalResponseAction;
			break;
		}

		case ActionsType.Failure:
			action = {
				type: ActionsType.Failure,
				reason: actionConfigs[ActionsType.Failure].reason,
			} as FailureAction;
			break;
	}

	return {
		id,
		active,
		filter: {
			url: filter.url,
			resourceTypes: filter.resourceTypes,
			methods: filter.methods,
		},
		action,
	};
}
