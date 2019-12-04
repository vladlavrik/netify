import * as yup from 'yup';
import {ResponseBreakpoint} from '@/interfaces/breakpoint';
import {headersSchema, statusCodeSchema, responseBodySchema} from './common';

export const formSchema = yup.object<ResponseBreakpoint>({
	requestId: yup.string(),
	url: yup.string(),
	statusCode: statusCodeSchema,
	headers: headersSchema,
	body: responseBodySchema,
});
