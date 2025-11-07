import {array, mixed, object, string} from 'yup';
import {RequestBodyType, requestBodyTypesList} from '@/constants/RequestBodyType';

export const requestBodySchema = object({
	type: mixed<'Original' | RequestBodyType>()
		.oneOf(['Original', ...requestBodyTypesList])
		.required(),
	textValue: string().default(''),
	formValue: array()
		.of(
			object({
				key: string()
					.default('')
					.when('value', {
						is(value: string) {
							return !value;
						},
						then: (schema) => schema,
						otherwise: (schema) => schema.required('Key is required when the value is not empty'),
					}),
				value: string().default(''),
			}),
		)
		.default([]),
});
