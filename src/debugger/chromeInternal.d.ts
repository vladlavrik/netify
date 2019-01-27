import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';
import {CancelReasons} from '@/constants/CancelReasons';

interface RequestHeaders {
	[name: string]: string;
}

interface DebuggerRequest {
	url: string;
	method: RequestMethod;
	resourceType: ResourceType;
	urlFragment?: string;
	headers: RequestHeaders;
}

interface RequestEventParams {
	interceptionId: string;
	request: DebuggerRequest;
	resourceType: ResourceType;
	//..TODO
}
interface CompletedRequestEventParams extends RequestEventParams {
	responseHeaders: RequestHeaders;
	responseErrorReason: CancelReasons;
	responseStatusCode: number;
	//..TODO
}

interface ContinueRequestParams {
	interceptionId: string;
	errorReason?: CancelReasons;
	rawResponse?: string;
	url?: string;
	method?: RequestMethod;
	postData?: string;
	headers?: RequestHeaders;
}

interface GetInterceptedBodyResponse {
	body: string;
	base64Encoded: boolean;
}
