import {HeadersArray} from '@/interfaces/headers';
import {RequestBody, ResponseBody} from '@/interfaces/body';
import {
	Action,
	BreakpointAction,
	DelayAction,
	FailureAction,
	LocalResponseAction,
	MutationAction,
	Rule,
} from '@/interfaces/rule';
import {RuleActionsType} from '@/constants/RuleActionsType';
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
			if (fileValue) {
				return {
					type,
					value: fileValue,
				};
			} else {
				return undefined;
			}
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
	const {label, filter, actionType, actionConfigs} = form;

	let action: Action;

	switch (actionType) {
		case RuleActionsType.Breakpoint: {
			const {stage} = actionConfigs[RuleActionsType.Breakpoint];
			action = {
				type: RuleActionsType.Breakpoint,
				request: [BreakpointStage.Both, BreakpointStage.Request].includes(stage),
				response: [BreakpointStage.Both, BreakpointStage.Response].includes(stage),
			} as BreakpointAction;
			break;
		}

		case RuleActionsType.Mutation: {
			const {request, response} = actionConfigs[RuleActionsType.Mutation];
			action = {
				type: RuleActionsType.Mutation,
				request: {
					endpoint: request.endpoint || undefined,
					method: request.method,
					setHeaders: deserializeSetHeaders(request.setHeaders),
					dropHeaders: deserializeDropHeaders(request.dropHeaders),
					body: deserializeRequestBody(request.body),
				},
				response: {
					statusCode: response.statusCode ? Number(response.statusCode) : undefined,
					setHeaders: deserializeSetHeaders(response.setHeaders),
					dropHeaders: deserializeDropHeaders(response.dropHeaders),
					body: deserializeResponseBody(response.body),
				},
			} as MutationAction;
			break;
		}

		case RuleActionsType.LocalResponse: {
			const {statusCode, headers, body} = actionConfigs[RuleActionsType.LocalResponse];

			action = {
				type: RuleActionsType.LocalResponse,
				statusCode: Number(statusCode),
				headers: deserializeSetHeaders(headers),
				body: deserializeResponseBody(body)!,
			} as LocalResponseAction;
			break;
		}

		case RuleActionsType.Failure:
			action = {
				type: RuleActionsType.Failure,
				reason: actionConfigs[RuleActionsType.Failure].reason,
			} as FailureAction;
			break;

		case RuleActionsType.Delay:
			action = {
				type: RuleActionsType.Delay,
				timeout: Number(actionConfigs[RuleActionsType.Delay].timeout),
			} as DelayAction;
			break;
	}

	return {
		id,
		label,
		active,
		filter: {
			url: filter.url,
			resourceTypes: filter.resourceTypes,
			methods: filter.methods,
		},
		action,
	};
}
