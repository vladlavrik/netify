import * as yup from 'yup';
import {trimString} from '@/helpers/formatter';
import {Rule} from '@/interfaces/Rule';
import {randomHex} from '@/helpers/random';
import {urlCompareTypeList} from '@/constants/UrlCompareType';
import {resourceTypesList} from '@/constants/ResourceType';
import {requestMethodsList} from '@/constants/RequestMethod';
import {requestBodyTypesList} from '@/constants/RequestBodyType';
import {responseBodyTypesList} from '@/constants/ResponseBodyType';
import {cancelReasonsList} from '@/constants/CancelReasons';

const headersSchema = yup.mixed().transform((value: {name: string; value: string}[]) => {
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

export const formSchema = yup.object<Rule>({
	id: yup.string().default(() => randomHex(16)),
	filter: yup.object({
		url: yup.object({
			value: yup.string(),
			compareType: yup.mixed().oneOf(urlCompareTypeList),
		}),
		resourceTypes: yup.array().of(yup.mixed().oneOf(resourceTypesList)),
		methods: yup.array().of(yup.mixed().oneOf(requestMethodsList)),
	}),
	actions: yup.object({
		mutateRequest: yup.object({
			enabled: yup.boolean(),
			endpointReplace: yup.string(),
			methodReplace: yup
				.mixed()
				.oneOf(requestMethodsList)
				.nullable(true),
			headers: headersSchema,
			bodyReplace: yup.object({
				type: yup.mixed().oneOf(requestBodyTypesList),
				textValue: yup.string(),
				formValue: yup
					.array()
					.of(
						yup.object({
							key: yup.string(),
							value: yup.string(),
						}),
					)
					.transform((values: {key: string; value: string}[]) => {
						// clean empty items
						return values.filter(({key}) => trimString(key).length > 0);
					}),
			}),
		}),
		mutateResponse: yup.object({
			enabled: yup.boolean(),
			responseLocally: yup.mixed().transform((value: '0' | '1') => value === '1'),
			statusCode: yup
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
				.test(
					'typeError',
					'Status code must be a number value in range 100 - 599',
					(value: null | number | string) => {
						return value === null || (typeof value === 'number' && value >= 100 && value < 600);
					},
				),
			headers: headersSchema,
			bodyReplace: yup.object({
				type: yup.mixed().oneOf(responseBodyTypesList),
				textValue: yup.string(),
				fileValue: yup.mixed().nullable(false),
			}),
		}),
		cancelRequest: yup.object({
			enabled: yup.boolean(),
			reason: yup.mixed().oneOf(cancelReasonsList),
		}),
	}),
});
