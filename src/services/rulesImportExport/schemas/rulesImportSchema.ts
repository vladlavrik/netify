import {toByteArray} from 'base64-js';
import {z} from 'zod';
import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
import {ResponseErrorReason} from '@/constants/ResponseErrorReason';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {headersListSchema} from './headersListSchema';
import {requestBodySchema} from './requestBodySchema';

export const responseBodySchema = z
	.union([
		z.object({
			type: z.union([z.literal(ResponseBodyType.Text), z.literal(ResponseBodyType.Base64)]),
			value: z.string(),
		}),
		z.object({
			type: z.literal(ResponseBodyType.File),
			value: z.object({
				content: z.string(),
				name: z.string(),
			}),
		}),
	])
	.transform((body) => {
		if (body.type !== ResponseBodyType.File) {
			return body;
		}

		const contentStartIndex = body.value.content.indexOf(',') + 1;
		let file;
		try {
			const fileSource = toByteArray(body.value.content.substring(contentStartIndex));
			file = new File([fileSource], body.value.name);
		} catch (error) {
			console.error(error);
			return {
				type: ResponseBodyType.Text as const,
				value: '<<FAILED FILE TO DECODE RESULT>>',
			};
		}

		return {
			type: ResponseBodyType.File as const,
			value: file,
		};
	});

export const rulesImportSchema = z.object({
	version: z.number(),
	rules: z.array(
		z.object({
			id: z.string(),
			label: z.string().optional(),
			active: z.boolean().default(true),
			filter: z.object({
				url: z.string().default(''),
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
						statusCode: z.number().optional(),
						setHeaders: headersListSchema,
						dropHeaders: z.array(z.string()),
						body: responseBodySchema.optional(),
					}),
				}),
				z.object({
					type: z.literal(RuleActionsType.LocalResponse),
					statusCode: z.number(),
					headers: headersListSchema,
					body: responseBodySchema,
				}),
				z.object({
					type: z.literal(RuleActionsType.Failure),
					reason: z.nativeEnum(ResponseErrorReason),
				}),
			]),
		}),
	),
});
