import {RequestMethod} from '@/constants/RequestMethod';
import {RequestBody, ResponseBody} from '@/interfaces/body';
import {HeadersArray} from '@/interfaces/headers';

export interface RequestBreakpoint {
	stage: 'Request';
	requestId: string;
	url: string;
	method: RequestMethod;
	headers: HeadersArray;
	body: RequestBody;
}

export interface ResponseBreakpoint {
	stage: 'Response';
	requestId: string;
	url: string;
	statusCode: number;
	headers: HeadersArray;
	body: ResponseBody;
}

export type Breakpoint = RequestBreakpoint | ResponseBreakpoint;
