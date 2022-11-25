import {InferType, object, string} from 'yup';
import {requestBodySchema} from '@/components/@common/formsKit/RequestBodyField';
import {requestMethodSchema} from '@/components/@common/formsKit/RequestMethodField';
import {setHeadersSchema} from '@/components/@common/formsKit/SetHeadersField';

export const breakpointRequestFormSchema = object({
	endpoint: string().matches(/^https?:\/\/.+/, 'The endpoint url should be started with a http(s) protocol'),
	method: requestMethodSchema,
	headers: setHeadersSchema,
	body: requestBodySchema,
}).required();

export type BreakpointRequestFormSchema = InferType<typeof breakpointRequestFormSchema>;
