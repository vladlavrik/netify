import {mixed, object, string} from 'yup';
import {ResponseBodyType, responseBodyTypesList} from '@/constants/ResponseBodyType';

export const responseBodySchema = object({
	type: mixed<'Original' | ResponseBodyType>().oneOf(['Original', ...responseBodyTypesList]),
	textValue: string().when('type', {
		is: ResponseBodyType.Base64,
		then: string().matches(/^[A-Za-z0-9+/]*(={1,3})?$/, 'Invalid Base 64'),
		otherwise: string(),
	}),
	fileValue: mixed<File>().notRequired(),
});
