import {InferType, object} from 'yup';
import {responseBodySchema} from '@/components/@common/formsKit/ResponseBodyField';
import {setHeadersSchema} from '@/components/@common/formsKit/SetHeadersField';
import {statusCodeSchema} from '@/components/@common/formsKit/StatusCodeField';

export const breakpointResponseFormSchema = object({
	statusCode: statusCodeSchema.required(),
	headers: setHeadersSchema.required(),
	body: responseBodySchema,
}).required();

export type BreakpointResponseFormSchema = InferType<typeof breakpointResponseFormSchema>;
