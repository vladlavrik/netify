import * as yup from 'yup';
import {Rule} from '@/interfaces/Rule';
import {randomHex} from '@/helpers/random';
import {urlCompareTypeList} from '@/constants/UrlCompareType';
import {resourceTypesList} from '@/constants/ResourceType';
import {requestMethodsList} from '@/constants/RequestMethod';
import {cancelReasonsList} from '@/constants/CancelReasons';
import {
	headersUpdateSchema,
	optionalStatusCodeSchema,
	methodSchema,
	requestBodySchema,
	responseBodySchema,
} from './common';

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
	intercept: yup.object({
		request: yup.bool(),
		response: yup.bool(),
	}),
	actions: yup.object({
		mutateRequest: yup.object({
			enabled: yup.boolean(),
			endpointReplace: yup.string(), // TODO validate url or patterns
			methodReplace: methodSchema,
			headers: headersUpdateSchema,
			bodyReplace: requestBodySchema,
		}),
		mutateResponse: yup.object({
			enabled: yup.boolean(),
			responseLocally: yup.mixed().transform((value: '0' | '1') => value === '1'),
			statusCode: optionalStatusCodeSchema,
			headers: headersUpdateSchema,
			bodyReplace: responseBodySchema,
		}),
		cancelRequest: yup.object({
			enabled: yup.boolean(),
			reason: yup.mixed().oneOf(cancelReasonsList),
		}),
	}),
});
