import {Protocol} from 'devtools-protocol';
import {RequestBodyType} from '@/constants/RequestBodyType';
import {RequestMethod} from '@/constants/RequestMethod';
import {RequestBody} from '@/interfaces/body';
import {RequestBreakpointInput} from '@/interfaces/breakpoint';
import {HeadersArray} from '@/interfaces/headers';
import {MutationRuleAction} from '@/interfaces/rule';
import {randomHex} from '@/helpers/random';
import {headersMapToArray, patchHeaders} from './helpers/headers';
import {
	buildRequestBodyFromMultipartForm,
	buildRequestBodyFromText,
	buildRequestBodyFromUrlEncodedForm,
	parseUrlEncodedForm,
	parseUrlMultipartForm,
} from './helpers/postData';
import {compileUrlFromPattern} from './helpers/url';

type RequestPausedEvent = Protocol.Fetch.RequestPausedEvent;
type ContinueRequestRequest = Protocol.Fetch.ContinueRequestRequest;
type HeaderEntry = Protocol.Fetch.HeaderEntry;

/**
 * Request handler provides processing the paused request to:
 *  - apply patch by a rule
 *  - transform to a breakpoint data and vise-versa - updated breakpoint data to a data for continue the request (FUTURE)
 */
export class RequestBuilder {
	static asRequestPatch({request, requestId}: RequestPausedEvent, patch: MutationRuleAction['request']) {
		// Rewrite request params before send to server
		let url;
		if (patch.endpoint) {
			url = compileUrlFromPattern(patch.endpoint, request.url);
		}

		// Ignore new method is it the same as original
		let method;
		if (patch.method && patch.method !== request.method) {
			method = patch.method;
		}

		// Then, patch headers list
		const originalHeaders = headersMapToArray(request.headers);
		let headers;
		if (patch.setHeaders.length || patch.dropHeaders.length) {
			headers = patchHeaders(originalHeaders, patch.setHeaders, patch.dropHeaders);
		}

		if (patch.body) {
			const hasContentType = (headers || originalHeaders).some(({name}) => name.toLowerCase() === 'content-type');
			if (!hasContentType) {
				headers = headers || originalHeaders;
				headers.push({name: 'Content-Type', value: 'text/plain'});
			}
		}

		return new this(requestId, url, method, headers, patch.body);
	}

	static asScriptResult(
		requestId: string,
		patch: {url?: string; method?: RequestMethod; headers?: Record<string, string>; body?: string},
	) {
		const {url, method} = patch;
		const headers = patch.headers ? headersMapToArray(patch.headers) : undefined;
		const body: RequestBody | undefined = patch.body ? {type: RequestBodyType.Text, value: patch.body} : undefined;
		return new this(requestId, url, method, headers, body);
	}

	static asBreakpointExecute(
		requestId: string,
		{url, method, headers, body}: {url: string; method: RequestMethod; headers: HeadersArray; body?: RequestBody},
	) {
		return new this(requestId, url, method, headers, body);
	}

	static compileBreakpoint({request}: RequestPausedEvent): RequestBreakpointInput {
		let body: RequestBody | undefined;
		const contentType = new Headers(request.headers).get('content-type')?.toLowerCase();

		if (!request.hasPostData) {
			body = {
				type: RequestBodyType.Text,
				value: '',
			};
		} else if (!request.postData) {
			body = undefined;
		} else if (contentType?.startsWith('application/x-www-form-urlencoded')) {
			try {
				body = {
					type: RequestBodyType.UrlEncodedForm,
					value: parseUrlEncodedForm(request.postData),
				};
			} catch (error) {
				console.error(error);
			}
		} else if (contentType?.startsWith('multipart/form-data')) {
			const boundary = contentType
				.split(/; ?/)
				.map((part) => part.split('='))
				.find(([key]) => key === 'boundary')?.[1];

			if (boundary) {
				try {
					body = {
						type: RequestBodyType.MultipartFromData,
						value: parseUrlMultipartForm(request.postData, boundary),
					};
				} catch (error) {
					console.error(error);
				}
			}
		} else if (contentType?.startsWith('application/json')) {
			body = {
				type: RequestBodyType.JSON,
				value: request.postData || '',
			};
		} else if (contentType?.startsWith('application/octet-stream')) {
			body = undefined;
		} else {
			body = {
				type: RequestBodyType.Text,
				value: request.postData || '',
			};
		}

		return {
			url: request.url,
			method: request.method as RequestMethod,
			headers: Object.entries(request.headers).map(([name, value]) => ({name, value})),
			body,
		};
	}

	private constructor(
		private readonly requestId: string,
		private readonly url?: string,
		private readonly method?: RequestMethod,
		private readonly headers?: HeaderEntry[],
		private readonly body?: RequestBody,
	) {}

	build() {
		const data: ContinueRequestRequest = {
			requestId: this.requestId,
			url: this.url,
			method: this.method,
			headers: this.headers,
		};

		if (!this.body) {
			return data;
		}

		let postData: string | undefined;
		let postDataType: string | undefined;

		switch (this.body.type) {
			case RequestBodyType.Text:
				postData = buildRequestBodyFromText(this.body.value);
				break;
			case RequestBodyType.JSON:
				postData = buildRequestBodyFromText(this.body.value);
				postDataType = 'application/json';
				break;

			case RequestBodyType.UrlEncodedForm:
				postData = buildRequestBodyFromUrlEncodedForm(this.body.value);
				postDataType = 'application/x-www-form-urlencoded';
				break;

			case RequestBodyType.MultipartFromData: {
				const boundary = `----NetifyFormBoundary${randomHex(24)}`;
				postData = buildRequestBodyFromMultipartForm(this.body.value, boundary);
				postDataType = `multipart/form-data; boundary=${boundary}`;
				break;
			}
		}

		if (postData) {
			if (postDataType) {
				data.headers = patchHeaders(this.headers || [], [{name: 'Content-Type', value: postDataType}], []);
			}

			data.postData = postData;
		}

		return data;
	}
}
