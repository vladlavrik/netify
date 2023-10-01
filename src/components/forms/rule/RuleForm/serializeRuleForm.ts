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
 * @callback nextCallback
 * @param {Object} patch
 * @param {string} patch.method - method name in UPPER CASE
 * @param {Object} patch.headers - key-value headers
 * @param {string} patch.body
 */

/** @param {Object} request
 * @param {number} request.statusCode
 * @param {Object} request.headers - key-value headers
 * @param {string} request.body
 * @param {nextCallback} next
 */
function request(request, next) {
  return next({
  	method: request.method,
  	headers: request.headers,
  	body: request.body,
  });
}
`.trim();

// language=js
const defaultResponseScript = `
/**
 * @callback nextCallback
 * @param {Object} patch
 * @param {number} patch.statusCode
 * @param {Object} patch.headers - key-value headers
 * @param {(string|Blob)} patch.body
 */

 /** @param {Object} response
 * @param {number} response.statusCode
 * @param {Object} response.headers - key-value headers
 * @param {Blob} response.body
 * @param {nextCallback} next
 */
function response(response, next) {
  return next({
    statusCode: response.statusCode,
    headers: response.headers,
    body: response.body,
  });
}
`.trim();

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
				request: defaultRequestScript,
				response: defaultResponseScript,
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

			responseValue.delay = response.delay;
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
			const {delay, statusCode, headers, body} = action;
			const responseValue = value.actionConfigs[RuleActionsType.LocalResponse];

			responseValue.delay = delay;
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

		case RuleActionsType.Script: {
			value.actionConfigs[RuleActionsType.Script].request = action.request || defaultRequestScript;
			value.actionConfigs[RuleActionsType.Script].response = action.response || defaultResponseScript;
			break;
		}
	}

	return value;
}
