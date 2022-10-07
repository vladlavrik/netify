import {BreakpointStage} from '@/constants/BreakpointStage';
import {RequestBodyType} from '@/constants/RequestBodyType';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {RequestBody, ResponseBody} from '@/interfaces/body';
import {
	BreakpointRuleAction,
	FailureRuleAction,
	LocalResponseRuleAction,
	MutationRuleAction,
	Rule,
	RuleAction,
} from '@/interfaces/rule';
import {RequestBodySchema, ResponseBodySchema, RuleFormSchema} from './ruleFormSchema';

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

export function deserializeRuleForm(form: RuleFormSchema, id: string, active: boolean): Rule {
	const {label, filter, actionType, actionConfigs} = form;

	let action: RuleAction;

	switch (actionType) {
		case RuleActionsType.Breakpoint: {
			const {stage} = actionConfigs[RuleActionsType.Breakpoint];
			action = {
				type: RuleActionsType.Breakpoint,
				request: [BreakpointStage.Both, BreakpointStage.Request].includes(stage),
				response: [BreakpointStage.Both, BreakpointStage.Response].includes(stage),
			} as BreakpointRuleAction;
			break;
		}

		case RuleActionsType.Mutation: {
			const {request, response} = actionConfigs[RuleActionsType.Mutation];
			action = {
				type: RuleActionsType.Mutation,
				request: {
					endpoint: request.endpoint || undefined,
					method: request.method,
					setHeaders: request.setHeaders,
					dropHeaders: request.dropHeaders,
					body: deserializeRequestBody(request.body),
				},
				response: {
					statusCode: response.statusCode ? Number(response.statusCode) : undefined,
					setHeaders: request.setHeaders,
					dropHeaders: response.dropHeaders,
					body: deserializeResponseBody(response.body),
				},
			} as MutationRuleAction;
			break;
		}

		case RuleActionsType.LocalResponse: {
			const {statusCode, headers, body} = actionConfigs[RuleActionsType.LocalResponse];

			action = {
				type: RuleActionsType.LocalResponse,
				statusCode: Number(statusCode),
				headers,
				body: deserializeResponseBody(body)!,
			} as LocalResponseRuleAction;
			break;
		}

		case RuleActionsType.Failure:
			action = {
				type: RuleActionsType.Failure,
				reason: actionConfigs[RuleActionsType.Failure].reason,
			} as FailureRuleAction;
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
