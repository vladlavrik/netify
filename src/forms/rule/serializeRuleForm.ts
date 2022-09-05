import {BreakpointStage} from '@/constants/BreakpointStage';
import {RequestBodyType} from '@/constants/RequestBodyType';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
import {ResponseErrorReason} from '@/constants/ResponseErrorReason';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {Rule} from '@/interfaces/Rule';
import {RuleFormSchema} from './ruleFormSchema';

export function serializeRuleForm(rule: Rule) {
	const {label, filter, action} = rule;

	const value: RuleFormSchema = {
		label,
		filter: {
			url: filter.url,
			resourceTypes: filter.resourceTypes,
			methods: filter.methods,
		},
		actionType: action.type,
		actionConfigs: {
			[RuleActionsType.Breakpoint]: {
				stage: BreakpointStage.Both,
			},
			[RuleActionsType.Mutation]: {
				request: {
					endpoint: '',
					method: undefined,
					setHeaders: [{name: '', value: ''}],
					dropHeaders: [''],
					body: {
						type: 'Original',
						textValue: '',
						formValue: [{key: '', value: ''}],
					},
				},
				response: {
					statusCode: undefined,
					setHeaders: [{name: '', value: ''}],
					dropHeaders: [''],
					body: {
						type: 'Original',
						textValue: '',
						fileValue: undefined,
					},
				},
			},
			[RuleActionsType.LocalResponse]: {
				statusCode: 200,
				headers: [{name: '', value: ''}],
				body: {
					type: ResponseBodyType.Text,
					textValue: '',
					fileValue: undefined,
				},
			},
			[RuleActionsType.Failure]: {
				reason: ResponseErrorReason.Failed,
			},
		},
	};

	switch (action.type) {
		case RuleActionsType.Breakpoint: {
			const {request, response} = action;
			let stage;
			if (request && response) {
				stage = BreakpointStage.Both;
			} else if (request) {
				stage = BreakpointStage.Request;
			} else {
				stage = BreakpointStage.Response;
			}

			value.actionConfigs[RuleActionsType.Breakpoint].stage = stage;
			break;
		}

		case RuleActionsType.Mutation: {
			const {request, response} = action;

			const requestValue = value.actionConfigs[RuleActionsType.Mutation].request;
			const responseValue = value.actionConfigs[RuleActionsType.Mutation].response;

			requestValue.endpoint = request.endpoint || '';
			requestValue.method = request.method;
			requestValue.setHeaders.unshift(...request.setHeaders);
			requestValue.dropHeaders.unshift(...request.dropHeaders);
			if (request.body) {
				requestValue.body.type = request.body.type;

				switch (request.body.type) {
					case RequestBodyType.Text:
						requestValue.body.textValue = request.body.value || '';
						break;

					case RequestBodyType.MultipartFromData:
					case RequestBodyType.UrlEncodedForm:
						requestValue.body.formValue.unshift(...request.body.value);
				}
			}

			responseValue.statusCode = response.statusCode;
			responseValue.setHeaders.unshift(...response.setHeaders);
			responseValue.dropHeaders.unshift(...response.dropHeaders);
			if (response.body) {
				responseValue.body.type = response.body.type;

				switch (response.body.type) {
					case ResponseBodyType.Text:
					case ResponseBodyType.Base64:
						responseValue.body.textValue = response.body.value || '';
						break;

					case ResponseBodyType.File:
						responseValue.body.fileValue = response.body.value;
				}
			}
			break;
		}

		case RuleActionsType.LocalResponse: {
			const {statusCode, headers, body} = action;
			const responseValue = value.actionConfigs[RuleActionsType.LocalResponse];

			responseValue.statusCode = statusCode;
			responseValue.headers.unshift(...headers);

			responseValue.body.type = body.type;

			switch (body.type) {
				case ResponseBodyType.Text:
				case ResponseBodyType.Base64:
					responseValue.body.textValue = body.value || '';
					break;

				case ResponseBodyType.File:
					responseValue.body.fileValue = body.value;
			}
			break;
		}

		case RuleActionsType.Failure: {
			value.actionConfigs[RuleActionsType.Failure].reason = action.reason;
			break;
		}
	}

	return value;
}
