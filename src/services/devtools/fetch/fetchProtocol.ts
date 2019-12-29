import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';
import {ResponseErrorReason} from '@/constants/ResponseErrorReason';
import {HeadersMap, HeadersArray} from '@/interfaces/headers';

/*
 * Based on Chrome DevTools Protocol Viewer: Fetch and Network domains
 * https://chromedevtools.github.io/devtools-protocol
 */

export interface NetworkRequest {
	url: string;
	method: RequestMethod;
	resourceType: ResourceType;
	urlFragment?: string;
	headers: HeadersMap;
	postData?: string;
	hasPostData?: boolean;
	// TODO skip if isLinkPreload
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
	responseErrorReason: ResponseErrorReason;
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
	body?: string; // Base64 encoded
}

export interface FailRequestData {
	requestId: string;
	errorReason: ResponseErrorReason;
}

export interface GetResponseBodyResult {
	body: string;
	base64Encoded: boolean;
}
