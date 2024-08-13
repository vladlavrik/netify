import {array, boolean, InferType, mixed, number, object, string} from 'yup';
import {BreakpointStage, breakpointStagesList} from '@/constants/BreakpointStage';
import {RequestMethod, requestMethodsList} from '@/constants/RequestMethod';
import {ResourceType, resourceTypesList} from '@/constants/ResourceType';
import {ResponseErrorReason, responseErrorReasonsList} from '@/constants/ResponseErrorReason';
import {RuleActionsType, ruleActionsTypesList} from '@/constants/RuleActionsType';
import {requestBodySchema} from '@/components/@common/formsKit/RequestBodyField';
import {requestMethodSchema} from '@/components/@common/formsKit/RequestMethodField';
import {responseBodySchema} from '@/components/@common/formsKit/ResponseBodyField';
import {setHeadersSchema} from '@/components/@common/formsKit/SetHeadersField';
import {statusCodeSchema} from '@/components/@common/formsKit/StatusCodeField';

const delaySchema = number()
	.typeError('Should be a number')
	.min(0, 'Should be s positive')
	.max(60000, 'Max value is 60000 (60s)');

export const ruleFormSchema = object({
	label: string(),
	filter: object({
		url: string().trim().default(''),
		resourceTypes: array().of(mixed<ResourceType>().oneOf(resourceTypesList).defined()).default([]),
		methods: array().of(mixed<RequestMethod>().oneOf(requestMethodsList).defined()).default([]),
	}).defined(),
	actionType: mixed<RuleActionsType>().oneOf(ruleActionsTypesList).required(),
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
				method: requestMethodSchema,
				setHeaders: setHeadersSchema.defined(),
				dropHeaders: array()
					.of(string().trim().defined())
					.defined()
					.transform((value: string[]) => value.filter((item) => item && item.trim())),
				body: requestBodySchema.defined(),
			}),
			response: object({
				delay: delaySchema,
				statusCode: statusCodeSchema, // TODO FIXME an error on clear defined before this field
				setHeaders: setHeadersSchema.defined(),
				dropHeaders: array()
					.of(string().trim().defined())
					.defined()
					.transform((value: string[]) => value.filter((item) => item && item.trim())),
				body: responseBodySchema.defined(),
			}),
		}).required(),
		[RuleActionsType.LocalResponse]: object({
			delay: delaySchema,
			statusCode: statusCodeSchema.required('Status code is required'),
			headers: setHeadersSchema.defined(),
			body: responseBodySchema.defined(),
		}),
		[RuleActionsType.Failure]: object({
			reason: mixed<ResponseErrorReason>().oneOf(responseErrorReasonsList).defined(),
		}),
		[RuleActionsType.Script]: object({
			request: object({
				enabled: boolean().defined(),
				code: string().trim().defined(),
			}),
			response: object({
				enabled: boolean().defined(),
				code: string().trim().defined(),
			}),
		}),
	}).required(),
}).required();

export type RuleFormSchema = InferType<typeof ruleFormSchema>;
export type RequestBodySchema = InferType<typeof requestBodySchema>;
export type ResponseBodySchema = InferType<typeof responseBodySchema>;
