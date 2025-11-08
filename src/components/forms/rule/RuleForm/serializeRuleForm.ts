import {BreakpointStage} from '@/constants/BreakpointStage';
import {RequestBodyType} from '@/constants/RequestBodyType';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
import {ResponseErrorReason} from '@/constants/ResponseErrorReason';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {Rule} from '@/interfaces/rule';
import {RuleFormSchema} from './ruleFormSchema';

// language=js
const defaultRequestScript = `
/**
 * @param {Object} request
 * @param {number} request.url
 * @param {string} request.method
 * @param {Object} request.headers - key-value headers
 * @param {Blob} request.body
 * @param {Object} actions
 * @param {Function} actions.setUrl
 * @param {Function} actions.setMethod
 * @param {Function} actions.setHeader
 * @param {Function} actions.setHeaders
 * @param {Function} actions.dropHeader
 * @param {Function} actions.resetHeaders
 * @param {Function} actions.setBody
 * @param {Function} actions.failure
 * @param {Function} actions.response
 */
async function handler(request, actions) {
  
}
`.trim();

// language=js
const defaultResponseScript = `
 /**
 * @param {Object} response
 * @param {number} response.statusCode
 * @param {Object} response.headers - key-value headers
 * @param {Blob} response.body
 * @param {Object} response.request
 * @param {string} response.request.url
 * @param {string} response.request.method
 * @param {Object} response.request.headers - key-value headers
 * @param {Blob} response.request.body
 * @param {Object} actions
 * @param {Function} actions.setStatusCode
 * @param {Function} actions.setHeader
 * @param {Function} actions.setHeaders
 * @param {Function} actions.dropHeader
 * @param {Function} actions.resetHeaders
 * @param {Function} actions.setBody
 */
async function handler(response, actions) {
  
}
`.trim();

export function serializeRuleForm(rule: Rule) {
	const {label, filter, action} = rule;

	const value: RuleFormSchema = {
		label,
		filter: {
			url: filter.url.trim(),
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
					delay: undefined,
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
				delay: undefined,
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
			[RuleActionsType.Script]: {
				request: {
					enabled: false,
					code: defaultRequestScript,
				},
				response: {
					enabled: false,
					code: defaultResponseScript,
				},
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
					case RequestBodyType.JSON:
						requestValue.body.textValue = request.body.value || '';
						break;

					case RequestBodyType.MultipartFromData:
					case RequestBodyType.UrlEncodedForm:
						requestValue.body.formValue.unshift(...request.body.value);
				}
			}

			responseValue.delay = response.delay;
			responseValue.statusCode = response.statusCode;
			responseValue.setHeaders.unshift(...response.setHeaders);
			responseValue.dropHeaders.unshift(...response.dropHeaders);
			if (response.body) {
				responseValue.body.type = response.body.type;

				switch (response.body.type) {
					case ResponseBodyType.Text:
					case ResponseBodyType.JSON:
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
			const {delay, statusCode, headers, body} = action;
			const responseValue = value.actionConfigs[RuleActionsType.LocalResponse];

			responseValue.delay = delay;
			responseValue.statusCode = statusCode;
			responseValue.headers.unshift(...headers);

			responseValue.body.type = body.type;

			switch (body.type) {
				case ResponseBodyType.Text:
				case ResponseBodyType.JSON:
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

		case RuleActionsType.Script: {
			value.actionConfigs[RuleActionsType.Script].request = action.request
				? {enabled: true, code: action.request}
				: {enabled: false, code: defaultRequestScript};
			value.actionConfigs[RuleActionsType.Script].response = action.response
				? {enabled: true, code: action.response}
				: {enabled: false, code: defaultResponseScript};
			break;
		}
	}

	return value;
}
