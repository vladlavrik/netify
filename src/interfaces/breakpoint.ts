import {RequestMethod} from '@/constants/RequestMethod';
import {ResponseErrorReason} from '@/constants/ResponseErrorReason';
import {RequestBody, ResponseBody} from '@/interfaces/body';
import {HeadersArray} from '@/interfaces/headers';

export interface RequestBreakpointInput {
	url: string;
	method: RequestMethod;
	headers: HeadersArray;
	body?: RequestBody;
}

export interface ResponseBreakpointInput {
	url: string;
	statusCode: number;
	headers: HeadersArray;
	body: ResponseBody;
}

export interface RequestBreakpoint {
	stage: 'Request';
	requestId: string;
	timestamp: number;
	data: RequestBreakpointInput;
	continue(params: {url: string; method: RequestMethod; headers: HeadersArray; body?: RequestBody}): Promise<void>;
	failure(reason: ResponseErrorReason): void;
}

export interface ResponseBreakpoint {
	stage: 'Response';
	requestId: string;
	timestamp: number;
	data: ResponseBreakpointInput;
	fulfill(params: {statusCode: number; headers: HeadersArray; body: ResponseBody}): Promise<void>;
}

export type Breakpoint = RequestBreakpoint | ResponseBreakpoint;
