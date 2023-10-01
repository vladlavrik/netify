import {z} from 'zod';
import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';
import {ResponseErrorReason} from '@/constants/ResponseErrorReason';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {headersListSchema} from './headersListSchema';
import {requestBodySchema} from './requestBodySchema';
import {responseBodySchema} from './responseBodySchema';

export const rulesExportSchema = z.object({
	version: z.number(),
	rules: z.array(
		z.object({
			id: z.string(),
			label: z.string().optional(),
			filter: z.object({
				url: z.string(),
				resourceTypes: z.array(z.nativeEnum(ResourceType)),
				methods: z.array(z.nativeEnum(RequestMethod)),
			}),
			action: z.union([
				z.object({
					type: z.literal(RuleActionsType.Breakpoint),
					request: z.boolean(),
					response: z.boolean(),
				}),
				z.object({
					type: z.literal(RuleActionsType.Mutation),
					request: z.object({
						endpoint: z.string().optional(),
						method: z.nativeEnum(RequestMethod).optional(),
						setHeaders: headersListSchema,
						dropHeaders: z.array(z.string()),
						body: requestBodySchema.optional(),
					}),
					response: z.object({
						delay: z.number().optional(),
						statusCode: z.number().optional(),
						setHeaders: headersListSchema,
						dropHeaders: z.array(z.string()),
						body: responseBodySchema.optional(),
					}),
				}),
				z.object({
					type: z.literal(RuleActionsType.LocalResponse),
					delay: z.number().optional(),
					statusCode: z.number(),
					headers: headersListSchema,
					body: responseBodySchema.optional(),
				}),
				z.object({
					type: z.literal(RuleActionsType.Failure),
					reason: z.nativeEnum(ResponseErrorReason),
				}),
				z.object({
					type: z.literal(RuleActionsType.Script),
					request: z.string(),
					response: z.string(),
				}),
			]),
		}),
	),
});

export type RuleExportInputSchema = z.input<typeof rulesExportSchema>;
