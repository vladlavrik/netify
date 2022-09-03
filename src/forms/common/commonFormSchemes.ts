import {array, mixed, number, object, string} from 'yup';
import {RequestBodyType, requestBodyTypesList} from '@/constants/RequestBodyType';
import {ResponseBodyType, responseBodyTypesList} from '@/constants/ResponseBodyType';

export const headersSchema = array().of(
	object({
		name: string().when('value', {
			is(value) {
				return !value;
			},
			then: string(),
			otherwise: string().required('Name is required when the value is not empty'),
		}),
		value: string(),
	}),
);

const statusCodeInvalidError = 'Invalid status code';

export const statusCodeSchema = number()
	.typeError(statusCodeInvalidError)
	.min(100, statusCodeInvalidError)
	.max(599, statusCodeInvalidError);

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

export const responseBodySchema = object({
	type: mixed<'Original' | ResponseBodyType>().oneOf(['Original', ...responseBodyTypesList]),
	textValue: string().when('type', {
		is: ResponseBodyType.Base64,
		then: string().matches(/^[A-Za-z0-9+/]*(={1,3})?$/, 'Invalid Base 64'),
		otherwise: string(),
	}),
	fileValue: mixed<File>().notRequired(),
});
