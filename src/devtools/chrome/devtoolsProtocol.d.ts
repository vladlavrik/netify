import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';
import {CancelReasons} from '@/constants/CancelReasons';
import {HeadersMap, HeadersArray} from '@/interfaces/headers';


export interface NetworkRequest {
	url: string;
	method: RequestMethod;
	resourceType: ResourceType;
	urlFragment?: string;
	headers: HeadersMap;
	postData?: string;
	//TODO skip if isLinkPreload
}

export interface PausedRequestEventData {
	requestId: string;
	request: NetworkRequest;
	frameId: string;
	networkId: string;
	resourceType: ResourceType;
}

export interface PausedResponseEventData extends PausedRequestEventData {
	responseHeaders: HeadersArray;
	responseErrorReason: CancelReasons; // TODO use it
	responseStatusCode: number;
}

export interface ContinueRequestData {
	requestId: string;
	url?: string;
	method?: RequestMethod;
	headers?: HeadersArray;
	postData?: string;
}

export interface FulfillRequestData {
	requestId: string;
	responseCode: number;
	responsePhrase?: string;
	responseHeaders: HeadersArray;
	body?: string; // base64 encoded
}

export interface FailRequestData {
	requestId: string;
	errorReason: CancelReasons;
}

export interface GetResponseBodyResult {
	body: string;
	base64Encoded: boolean;
}
