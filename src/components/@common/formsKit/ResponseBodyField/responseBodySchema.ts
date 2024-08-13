import {mixed, object, string} from 'yup';
import {ResponseBodyType, responseBodyTypesList} from '@/constants/ResponseBodyType';

export const responseBodySchema = object({
	type: mixed<'Original' | ResponseBodyType>()
		.oneOf(['Original', ...responseBodyTypesList])
		.required(),
	textValue: string()
		.when('type', {
			is: ResponseBodyType.Base64,
			then: (schema) => schema.matches(/^[A-Za-z0-9+/]*(={1,3})?$/, 'Invalid Base 64'),
			otherwise: (schema) => schema,
		})
		.default(''),
	fileValue: mixed<File>().notRequired(),
});
