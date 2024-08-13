import {array, object, string} from 'yup';

interface HeaderRecord {
	name: string;
	value: string;
}

export const setHeadersSchema = array()
	.of(
		object({
			name: string()
				.defined()
				.trim()
				.when('value', {
					is(value: string) {
						return !value;
					},
					then: (schema) => schema,
					otherwise: (schema) => schema.required('Name is required when the value is not empty'),
				}),
			value: string().default(''),
		}),
	)
	.defined()
	.transform(function (value) {
		if (this.isType(value)) {
			return value.filter((item) => !!item.name || !!item.value) as HeaderRecord[];
		}
		return value;
	});
