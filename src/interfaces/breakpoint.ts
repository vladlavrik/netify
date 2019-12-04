import {RequestMethod} from '@/constants/RequestMethod';
import {RequestBody, ResponseBody} from '@/interfaces/body';
import {HeadersArray} from '@/interfaces/headers';

export interface RequestBreakpoint {
	requestId: string;
	url: string;
	method: RequestMethod;
	headers: HeadersArray;
	body: RequestBody;
}

export interface ResponseBreakpoint {
	requestId: string;
	url: string;
	statusCode: number;
	headers: HeadersArray;
	body: ResponseBody;
}
