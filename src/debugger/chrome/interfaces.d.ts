import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';
import {CancelReasons} from '@/constants/CancelReasons';

interface HeadersMap {
	[name: string]: string;
}

interface Request {
	url: string;
	method: RequestMethod;
	resourceType: ResourceType;
	urlFragment?: string;
	headers: HeadersMap;
}

interface RequestEventParams {
	interceptionId: string;
	request: Request;
	resourceType: ResourceType;
	requestId: string;
	// ... has mote
}

interface CompletedRequestEventParams extends RequestEventParams {
	responseHeaders: HeadersMap;
	responseErrorReason: CancelReasons;
	responseStatusCode: number;
	// ... has mote
}

interface ContinueRequestParams {
	interceptionId: string;
	errorReason?: CancelReasons;
	rawResponse?: string;
	url?: string;
	method?: RequestMethod;
	postData?: string;
	headers?: HeadersMap;
}

interface GetInterceptedBodyResponse {
	body: string;
	base64Encoded: boolean;
}
