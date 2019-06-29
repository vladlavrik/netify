import * as yup from 'yup';
import {requestMethodsList} from '@/constants/RequestMethod';
import {requestBodyTypesList} from '@/constants/RequestBodyType';
import {responseBodyTypesList} from '@/constants/ResponseBodyType';
import {trimString} from '@/helpers/formatter';

export const headersSchema = yup
	.array()
	.of(yup.object({name: yup.string().trim(), value: yup.string().trim()}))
	.transform((value: {name: string; value: string}[]) => value.filter(item => item.name && item.value));

export const headersUpdateSchema = yup.mixed().transform((value: {name: string; value: string}[]) => {
	const add: {[name: string]: string} = {};
	const remove: string[] = [];

	for (const item of value) {
		const name = trimString(item.name);
		const value = trimString(item.value);

		if (name && value) {
			add[name] = value;
		} else if (name) {
			remove.push(name);
		}
	}
	return {add, remove};
});

const statusCodeValidError = 'Valid status code is required';
export const statusCodeSchema = yup
	.number()
	.required('Status code is required')
	.typeError(statusCodeValidError)
	.min(100, statusCodeValidError)
	.max(599, statusCodeValidError);

export const optionalStatusCodeSchema = yup
	.mixed()
	.transform((value: string) => {
		if (value === '') {
			return null;
		}
		if (!isNaN(+value)) {
			return +value;
		}
		return value;
	})
	.test('typeError', 'Status code must be a number value in range 100 - 599', (value: null | number | string) => {
		return value === null || (typeof value === 'number' && value >= 100 && value < 600);
	});

export const methodSchema = yup
	.mixed()
	.oneOf(requestMethodsList)
	.nullable(true);

export const requestBodySchema = yup.object({
	type: yup.mixed().oneOf(requestBodyTypesList),
	textValue: yup.string(),
	formValue: yup
		.array()
		.of(yup.object({key: yup.string().trim(), value: yup.string()}))
		.transform((values: {key: string}[]) => values.filter(({key}) => trimString(key))), // extra trim because it is not clear why the function receive not trimmed value
});

export const responseBodySchema = yup.object({
	type: yup.mixed().oneOf(responseBodyTypesList),
	textValue: yup.string(),
	fileValue: yup.mixed().nullable(false),
});
