import * as yup from 'yup';
import {RequestBreakpoint} from '@/interfaces/breakpoint';
import {headersSchema, methodSchema, requestBodySchema} from './common';

export const formSchema = yup.object<RequestBreakpoint>({
	requestId: yup.string(),
	url: yup
		.string()
		.matches(/ftp|https?:\/\/.+/, 'Endpoint must be a valid URL')
		.required('Endpoint is required'),
	method: methodSchema,
	headers: headersSchema,
	body: requestBodySchema,
});
