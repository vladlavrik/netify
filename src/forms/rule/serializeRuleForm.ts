import {RuleFormSchema} from './ruleFormSchema';
import {Rule} from '@/interfaces/Rule';
import {ActionsType} from '@/constants/ActionsType';
import {BreakpointStage} from '@/constants/BreakpointStage';
import {RequestBodyType} from '@/constants/RequestBodyType';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
import {ResponseErrorReason} from '@/constants/ResponseErrorReason';

export function serializeRuleForm(rule: Rule) {
	const {filter, action} = rule;

	const value: RuleFormSchema = {
		filter: {
			url: filter.url,
			resourceTypes: filter.resourceTypes,
			methods: filter.methods,
		},
		actionType: ActionsType.Mutation,
		actionConfigs: {
			[ActionsType.Breakpoint]: {
				stage: BreakpointStage.Both,
			},
			[ActionsType.Mutation]: {
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
			[ActionsType.LocalResponse]: {
				statusCode: 200,
				headers: [{name: '', value: ''}],
				body: {
					type: ResponseBodyType.Text,
					textValue: '',
					fileValue: undefined,
				},
			},
			[ActionsType.Failure]: {
				reason: ResponseErrorReason.Failed,
			},
		},
	};

	switch (action.type) {
		case ActionsType.Breakpoint: {
			const {request, response} = action;
			let stage;
			if (request && response) {
				stage = BreakpointStage.Both;
			} else if (request) {
				stage = BreakpointStage.Request;
			} else {
				stage = BreakpointStage.Response;
			}

			value.actionConfigs[ActionsType.Breakpoint].stage = stage;
			break;
		}

		case ActionsType.Mutation: {
			const {request, response} = action;

			const requestValue = value.actionConfigs[ActionsType.Mutation].request;
			const responseValue = value.actionConfigs[ActionsType.Mutation].response;

			requestValue.endpoint = request.endpoint || '';
			requestValue.method = request.method;
			requestValue.setHeaders.unshift(...request.setHeaders);
			requestValue.dropHeaders.unshift(...request.dropHeaders);
			if (request.body) {
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

		case ActionsType.LocalResponse: {
			const {statusCode, headers, body} = action;
			const responseValue = value.actionConfigs[ActionsType.LocalResponse];

			responseValue.statusCode = statusCode;
			responseValue.headers = headers;

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

		case ActionsType.Failure: {
			value.actionConfigs[ActionsType.Failure].reason = action.reason;
			break;
		}
	}

	return value;
}
