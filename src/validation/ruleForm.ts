import * as yup from 'yup';
import {Rule} from '@/interfaces/Rule';
import {randomHex} from '@/helpers/random';
import {urlCompareTypeList} from '@/constants/UrlCompareType';
import {resourceTypesList} from '@/constants/ResourceType';
import {requestMethodsList} from '@/constants/RequestMethod';
import {cancelReasonsList} from '@/constants/CancelReasons';
import {headersUpdateSchema, optionalStatusCodeSchema, methodSchema, requestBodySchema, responseBodySchema} from './common'; // prettier-ignore

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
		breakpoint: yup.object({
			request: yup.bool(),
			response: yup.bool(),
		}),
		mutate: yup.object({
			request: yup.object({
				enabled: yup.boolean(),
				endpoint: yup.string(), // TODO validate url or patterns
				method: methodSchema,
				headers: headersUpdateSchema,
				body: requestBodySchema,
			}),
			response: yup.object({
				enabled: yup.boolean(),
				responseLocally: yup.mixed().transform((value: '0' | '1') => value === '1'),
				statusCode: optionalStatusCodeSchema,
				headers: headersUpdateSchema,
				body: responseBodySchema,
			}),
		}),
		cancel: yup.object({
			enabled: yup.boolean(),
			reason: yup.mixed().oneOf(cancelReasonsList),
		}),
	}),
});
