import {array, object, string} from 'yup';

interface HeaderRecord {
	name: string;
	value: string;
}

export const setHeadersSchema = array()
	.of(
		object<HeaderRecord>({
			name: string()
				.trim()
				.when('value', {
					is(value) {
						return !value;
					},
					then: string(),
					otherwise: string().required('Name is required when the value is not empty'),
				}),
			value: string(),
		}),
	)
	.transform((value: HeaderRecord[]) => {
		return value.filter((item) => !!item.name && !!item.value);
	});
