import {toByteArray} from 'base64-js';
import {RequestMethod} from '@/constants/RequestMethod';
import type {Protocol} from 'devtools-protocol';

type RequestPausedEvent = Protocol.Fetch.RequestPausedEvent;
type ResponsePausedEvent = RequiredProps<RequestPausedEvent, 'responseStatusCode' | 'responseHeaders'>;

export type RequestScriptResult =
	| {
			type: 'failure';
			reason: string;
	  }
	| {
			type: 'response';
			response: {
				statusCode?: number;
				headers?: Record<string, string>;
				body?: string | Blob;
			};
	  }
	| {
			type: 'patch';
			patch: {
				url?: string;
				method?: RequestMethod;
				headers?: Record<string, string>;
				body?: string;
			};
	  }
	| undefined;

export type ResponseScriptResult =
	| {
			type: 'patch';
			patch: {
				statusCode?: number;
				headers?: Record<string, string>;
				body?: string | Blob;
			};
	  }
	| undefined;

export const makeRequestScriptScope = ({request}: RequestPausedEvent) => {
	return {
		request: {
			url: request.url,
			method: request.method,
			headers: request.headers,
			body: request.postData ? new Blob([request.postData]) : request.postData,
		},
	};
};

export const makeResponseScriptScope = (
	pausedResponse: ResponsePausedEvent,
	bodySource: {body: string; base64Encoded: boolean},
) => {
	const {request, responseStatusCode, responseHeaders} = pausedResponse;

	// Transform body from raw string or base64 encoded string to Blob
	let body;
	try {
		if (bodySource.body && !bodySource.base64Encoded) {
			body = new Blob([bodySource.body]);
		} else if (bodySource.body) {
			body = new Blob([toByteArray(bodySource.body) as BlobPart]);
		}
	} catch (error) {
		console.error(error);
	}

	return {
		response: {
			request: {
				url: request.url,
				method: request.method,
				headers: request.headers,
				body: request.postData ? new Blob([request.postData]) : request.postData,
			},
			statusCode: responseStatusCode,
			headers: Object.fromEntries(responseHeaders.map(({name, value}) => [name, value])),
			body,
		},
	};
};

export const makeRequestScriptCode = (handlerCode: string) => {
	// language=js
	return `
		(async function(){
			'use strict';
			${handlerCode};

			const __request = __scope__.request;
			const __result = {
				failureReason: undefined,
				responseData: undefined,
				patch: {},
			};
			Object.freeze(__request);
			Object.freeze(__request.headers);
			
			const __validateHeaders = (headers) => {
				for (const [name, value] of Object.entries(headers)) {
					const valueType = typeof value;
					if (valueType === 'number') {
						headers[name] = value.toString();
					} else if (valueType !== 'string') {
						throw new Error('Invalid header value by "' + name  + '", must be a string or number');
					}
				}
			}
		
			const __actions = {
		  		setUrl(newUrl) {
					__result.patch.url = newUrl;
				},
		  		setMethod(newMethod) {
					const caseCorrectNewMethod = newMethod.toUpperCase();
					const supportedMethods = "${Object.values(RequestMethod).join(',')}".split(',')
					if (supportedMethods.includes(caseCorrectNewMethod)) {
						__result.patch.method = caseCorrectNewMethod;
					} else {
						throw new Error('"setMethod" function failed due invalid method name set attempt. Supported ' + supportedMethods.join(', ') + ', but received: ' + newMethod);
					}
				},
				setHeader(name, value) {
					if (
						!name ||
						typeof name !== 'string' ||
						!(typeof value === 'string' || typeof value === 'number')
					) {
						throw new Error('"setHeader" function failed due invalid param "name"/"value" receiving');
					}
					__result.patch.headers = __result.patch.headers || {...__request.headers};
					__result.patch.headers[name] = value.toString();
				},
				setHeaders(headers) {
					__validateHeaders(headers);
					__result.patch.headers = {...(__result.patch.headers || __request.headers), ...headers};
				},
				dropHeader(name) {
			  		if (!name || typeof name !== 'string') {
				  		throw new Error('"dropHeader" function failed due invalid param "name" receiving');
					}
					__result.patch.headers = __result.patch.headers || {...__request.headers};
					const originalName = Object.keys(__result.patch.headers).find(item => item.toLowerCase() === name.toLowerCase());
					if (originalName) {
						delete __result.patch.headers[originalName];
					}
				},
				resetHeaders(newHeaders) {
					__result.patch.headers = {};
					if (newHeaders) {
						__actions.setHeaders(newHeaders);
					}
				},
				setBody(newBody) {
					if (typeof newBody !== 'string') {
						throw new Error('"setBody" function failed due invalid post data receiving, must be a string');
					}
					__result.patch.body = newBody;
				},
				failure(reason) {
					__result.failureReason = reason || 'Failed';
				},
				response({statusCode, headers, body} = {}) {
					__result.responseData = {};
					if (typeof statusCode === 'number' && statusCode >= 0 && statusCode < 600) {
						__result.responseData.statusCode = statusCode;
					} else if (statusCode !== undefined) {
						throw new Error('"response" function failed due invalid "statusCode" receiving, must be a number between 0 an 599');
					}
				
			  		if (headers && typeof headers === 'object') {
						__validateHeaders(headers);
						__result.responseData.headers = {...headers};
					} else if (headers) {
						throw new Error('"response" function failed due invalid "headers" receiving, must be a key value object');
					}
				
			  		if (body && (typeof body === 'string' || body instanceof Blob)) {
						__result.responseData.body = body;
					} else if (body) {
						throw new Error('"response" function failed due invalid "body" receiving, must be a string or Blob');
					}
				}
			}

			await handler(__request, __actions);
		  
			if (__result.failureReason) {
				return {
					type: 'failure',
					reason: __result.failureReason,
				};
			}
		  
			if (__result.responseData) {
				return {
					type: 'response',
					response: __result.responseData,
				};
			}
		  
			if (Object.keys(__result.patch).length) {
				return {
					type: 'patch',
					patch: __result.patch,
				};
			}
		})()
	`;
};

export const makeResponseScriptCode = (handlerCode: string) => {
	// language=js
	return `
		(async function(){
			'use strict';
			${handlerCode};

			const __response = __scope__.response;
			const __result = {
				patch: {},
			};

			Object.freeze(__response);
			Object.freeze(__response.headers);
			Object.freeze(__response.request);
			Object.freeze(__response.request.headers);


			const __actions = {
				setStatusCode(statusCode) {
					if (typeof statusCode === 'number') {
						__result.patch.statusCode = statusCode;
					} else {
						throw new Error('"response" function failed due invalid "statusCode" receiving, must be a string');
					}
				},
				setHeader(name, value) {
					if (
						!name ||
						typeof name !== 'string' ||
						!(typeof value === 'string' || typeof value === 'number')
					) {
						throw new Error('"setHeader" function failed due invalid param "name"/"value" receiving')
					}
					__result.patch.headers = __result.patch.headers || {...__response.headers};
					__result.patch.headers[name] = value.toString();
				},
				setHeaders(headers) {
					for (const [name, value] of Object.entries(headers)) {
						const valueType = typeof value;
						if (valueType === 'number') {
							headers[name] = value.toString();
						} else if (valueType !== 'string') {
							throw new Error('Invalid header value by "' + name  + '", must be a string or number');
						}
					}
					__result.patch.headers = {...(__result.patch.headers || __response.headers), ...headers}
				},
				dropHeader(name) {
					if (!name || typeof name !== 'string') {
						throw new Error('"dropHeader" function failed due invalid param "name" receiving')
					}
					__result.patch.headers = __result.patch.headers || {...__response.headers};
					const originalName = Object.keys(__result.patch.headers).find(item => item.toLowerCase() === name.toLowerCase());
					if (originalName) {
						delete __result.patch.headers[originalName];
					}
				},
				resetHeaders(newHeaders) {
					__result.patch.headers = {};
					if (newHeaders) {
						__actions.setHeaders(newHeaders);
					}
				},
				setBody(newBody) {
					if (typeof newBody !== 'string' && !(newBody instanceof Blob)) {
						throw new Error('"setBody" function failed due invalid body receiving, must be a string or Blob');
					}
					__result.patch.body = newBody;
				},
				
			}

			await handler(__response, __actions);

			if (Object.keys(__result.patch).length) {
				return {
					type: 'patch',
				  	patch: __result.patch,
				};
			}
		})()
	`;
};
