import * as yup from 'yup';
import {InterceptedRequest} from '@/interfaces/InterceptedRequest';
import {headersSchema, methodSchema, requestBodySchema} from './common';

export const formSchema = yup.object<InterceptedRequest>({
	interceptionId: yup.string(),
	isRequest: yup.mixed(),
	endpoint: yup
		.string()
		.url('Endpoint must be a valid URL')
		.required('Endpoint is required'),
	method: methodSchema,
	headers: headersSchema,
	body: requestBodySchema,
});
