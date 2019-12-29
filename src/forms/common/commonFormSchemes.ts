import {number, string, array, object, mixed} from 'yup';
import {requestBodyTypesList} from '@/constants/RequestBodyType';
import {responseBodyTypesList} from '@/constants/ResponseBodyType';

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
	.min(100, statusCodeInvalidError)
	.max(599, statusCodeInvalidError);

export const requestBodySchema = object({
	type: string()
		.oneOf(requestBodyTypesList)
		.notRequired(),
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
	type: string()
		.oneOf(responseBodyTypesList)
		.notRequired(),
	textValue: string(),
	fileValue: mixed<File>().notRequired(),
});
