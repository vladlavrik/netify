import {string, array, object, mixed, InferType} from 'yup';
import {resourceTypesList, ResourceType} from '@/constants/ResourceType';
import {requestMethodsList, RequestMethod} from '@/constants/RequestMethod';
import {actionsTypesList, ActionsType} from '@/constants/ActionsType';
import {breakpointStagesList, BreakpointStage} from '@/constants/BreakpointStage';
import {responseErrorReasonsList, ResponseErrorReason} from '@/constants/ResponseErrorReason';
import {statusCodeSchema, headersSchema, requestBodySchema, responseBodySchema} from '../common/commonFormSchemes';

export const ruleFormSchema = object({
	filter: object({
		url: string(),
		resourceTypes: array().of(mixed<ResourceType>().oneOf(resourceTypesList)),
		methods: array().of(mixed<RequestMethod>().oneOf(requestMethodsList)),
	}),
	actionType: mixed<ActionsType>().oneOf(actionsTypesList),
	actionConfigs: object({
		[ActionsType.Breakpoint]: object({
			stage: mixed<BreakpointStage>()
				.oneOf(breakpointStagesList)
				.default(BreakpointStage.Both),
		}),
		[ActionsType.Mutation]: object({
			request: object({
				endpoint: string().matches(
					/^((https?:)|(\[protocol]))\/\/.+/,
					'The endpoint url should be started with a protocol (or suitable macros) and have a hostname',
				),
				method: mixed<RequestMethod>()
					.oneOf(requestMethodsList)
					.notRequired(),
				setHeaders: headersSchema,
				dropHeaders: array().of(string()),
				body: requestBodySchema,
			}),
			response: object({
				statusCode: statusCodeSchema.notRequired(),
				setHeaders: headersSchema,
				dropHeaders: array().of(string()),
				body: responseBodySchema,
			}),
		}).required(),
		[ActionsType.LocalResponse]: object({
			statusCode: statusCodeSchema.required('Status code is required'),
			headers: headersSchema,
			body: responseBodySchema,
		}),
		[ActionsType.Failure]: object({
			reason: mixed<ResponseErrorReason>().oneOf(responseErrorReasonsList),
		}),
	}).required(),
}).required();

export type RuleFormSchema = InferType<typeof ruleFormSchema>;
export type RequestBodySchema = InferType<typeof requestBodySchema>;
export type ResponseBodySchema = InferType<typeof responseBodySchema>;
