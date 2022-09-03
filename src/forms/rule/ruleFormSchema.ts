import {array, InferType, mixed, object, string} from 'yup';
import {BreakpointStage, breakpointStagesList} from '@/constants/BreakpointStage';
import {RequestMethod, requestMethodsList} from '@/constants/RequestMethod';
import {ResourceType, resourceTypesList} from '@/constants/ResourceType';
import {ResponseErrorReason, responseErrorReasonsList} from '@/constants/ResponseErrorReason';
import {RuleActionsType, ruleActionsTypesList} from '@/constants/RuleActionsType';
import {headersSchema, requestBodySchema, responseBodySchema, statusCodeSchema} from '../common/commonFormSchemes';

export const ruleFormSchema = object({
	label: string().notRequired(),
	filter: object({
		url: string(),
		resourceTypes: array().of(mixed<ResourceType>().oneOf(resourceTypesList)),
		methods: array().of(mixed<RequestMethod>().oneOf(requestMethodsList)),
	}),
	actionType: mixed<RuleActionsType>().oneOf(ruleActionsTypesList),
	actionConfigs: object({
		[RuleActionsType.Breakpoint]: object({
			stage: mixed<BreakpointStage>().oneOf(breakpointStagesList).default(BreakpointStage.Both),
		}),
		[RuleActionsType.Mutation]: object({
			request: object({
				endpoint: string().matches(
					/^((https?:)|(\[protocol]))\/\/.+/,
					'The endpoint url should be started with a protocol (or suitable macros) and have a hostname',
				),
				method: mixed<RequestMethod>().oneOf(requestMethodsList).notRequired(),
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
		[RuleActionsType.LocalResponse]: object({
			statusCode: statusCodeSchema.required('Status code is required'),
			headers: headersSchema,
			body: responseBodySchema,
		}),
		[RuleActionsType.Failure]: object({
			reason: mixed<ResponseErrorReason>().oneOf(responseErrorReasonsList),
		}),
	}).required(),
}).required();

export type RuleFormSchema = InferType<typeof ruleFormSchema>;
export type RequestBodySchema = InferType<typeof requestBodySchema>;
export type ResponseBodySchema = InferType<typeof responseBodySchema>;
