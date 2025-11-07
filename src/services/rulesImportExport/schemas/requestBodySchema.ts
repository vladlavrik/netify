import {z} from 'zod';
import {RequestBodyType} from '@/constants/RequestBodyType';

export const requestBodySchema = z.union([
	z.object({
		type: z.union([z.literal(RequestBodyType.Text), z.literal(RequestBodyType.JSON)]),
		value: z.string(),
	}),
	z.object({
		type: z.union([z.literal(RequestBodyType.UrlEncodedForm), z.literal(RequestBodyType.MultipartFromData)]),
		value: z.array(
			z.object({
				key: z.string(),
				value: z.string(),
			}),
		),
	}),
]);
