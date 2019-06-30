import * as yup from 'yup';
import {InterceptedResponse} from '@/interfaces/InterceptedResponse';
import {headersSchema, statusCodeSchema, responseBodySchema} from './common';

export const formSchema = yup.object<InterceptedResponse>({
	interceptionId: yup.string(),
	isResponse: yup.mixed(),
	statusCode: statusCodeSchema,
	headers: headersSchema,
	body: responseBodySchema,
});
