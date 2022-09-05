import {Protocol} from 'devtools-protocol';
import {RequestBodyType} from '@/constants/RequestBodyType';
import {RequestMethod} from '@/constants/RequestMethod';
import {RequestBody} from '@/interfaces/body';
import {MutationRuleAction} from '@/interfaces/rule';
import {randomHex} from '@/helpers/random';
import {headersMapToArray, patchHeaders} from './helpers/headers';
import {buildRequestBodyFromMultipartForm, buildRequestBodyFromText, buildRequestBodyFromUrlEncodedForm} from './helpers/postData'; // prettier-ignore
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

	static asBreakpointExecute() {
		// TODO FUTURE
	}

	static compileBreakpoint() {
		// TODO FUTURE
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
