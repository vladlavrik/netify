import {array, mixed, object, string} from 'yup';
import {RequestBodyType, requestBodyTypesList} from '@/constants/RequestBodyType';

export const requestBodySchema = object({
	type: mixed<'Original' | RequestBodyType>().oneOf(['Original', ...requestBodyTypesList]),
	textValue: string(),
	formValue: array().of(
		object({
			key: string().when('value', {
				is(value) {
					return !value;
				},
				then: string(),
				otherwise: string().required('Key is required when the value is not empty'),
			}),
			value: string(),
		}),
	),
});
