import {randomHex} from '@/helpers/random';
import {RequestMethod} from '@/constants/RequestMethod';
import {RequestBodyType} from '@/constants/RequestBodyType';
import {HeadersArray} from '@/interfaces/headers';
import {RequestBreakpoint} from '@/interfaces/breakpoint';
import {Rule} from '@/interfaces/rule';
import {RequestBody} from '@/interfaces/body';
import {ContinueRequestData, PausedRequestEventData} from './fetchProtocol';
import {compileUrlFromPattern} from './helpers/url';
import {headersMapToArray, patchHeaders} from './helpers/headers';
import {extractRequestContentType} from './helpers/contentType';
import {buildRequestBodyFromMultipartForm, buildRequestBodyFromUrlEncodedForm, parseMultipartForm, parseUrlEncodedForm, extractMultipartFormBoundary} from './helpers/forms'; // prettier-ignore

// TODO comments all methods and class
export class RequestProcessor {
	static asRequestPatch({request, requestId}: PausedRequestEventData, rule: Rule) {
		const mutation = rule.actions.mutate.request;

		// rewrite request params before send to server
		let url;
		if (mutation.endpoint) {
			url = compileUrlFromPattern(mutation.endpoint, request.url);
		}

		// then, rewrite request method
		let method;
		if (mutation.method && mutation.method !== request.method) {
			method = mutation.method;
		}

		// then, patch headers list
		let headers;
		if (mutation.headers.add.length || mutation.headers.remove.length) {
			const initial = headersMapToArray(request.headers);
			const {add, remove} = mutation.headers;
			headers = patchHeaders(initial, add, remove);
		}

		return new this(requestId, url, method, headers, mutation.body);
	}

	static asBreakpointExecute({requestId, url, method, headers, body}: RequestBreakpoint) {
		return new this(requestId, url, method, headers, body);
	}

	static compileBreakpoint(requestData: PausedRequestEventData) {
		const {
			requestId,
			request: {url, method, headers, postData},
		} = requestData;

		const data: RequestBreakpoint = {
			requestId,
			url,
			method,
			headers: headersMapToArray(headers),
			body: {
				textValue: '',
				formValue: [],
			},
		};

		const headerKeys = Reflect.ownKeys(headers) as string[];
		const contentTypeHeader = headerKeys.find(name => name.toLowerCase() === 'content-type');
		const bodyType = contentTypeHeader ? extractRequestContentType(headers[contentTypeHeader]) : null;

		if (!postData && !bodyType) {
			return data;
		}

		switch (bodyType) {
			case RequestBodyType.Text:
				data.body.type = bodyType;
				data.body.textValue = postData || '';
				break;

			case RequestBodyType.UrlEncodedForm:
				data.body.type = bodyType;
				data.body.formValue = parseUrlEncodedForm(postData || '');
				break;

			case RequestBodyType.MultipartFromData:
				// "postData" is lost when multipart/from-data contains some blob value
				if (!postData) {
					break;
				}
				data.body.type = bodyType;
				const boundary = extractMultipartFormBoundary(headers[contentTypeHeader!]);
				if (boundary) {
					data.body.formValue = parseMultipartForm(postData, boundary);
				}
				break;

			default:
				// Content like a blob (but it also can be a text with incorrect or unknown content type)
				// If post data is defined - so it is a text type.
				// Otherwise post data is empty or blob type (chrome devtools do not support blob post data now)
				if (postData) {
					data.body.type = RequestBodyType.Text;
					data.body.textValue = postData || '';
				}
				break;
		}

		return data;
	}

	private constructor(
		private readonly requestId: string,
		private readonly url?: string,
		private readonly method?: RequestMethod,
		private readonly headers?: HeadersArray,
		private readonly body?: RequestBody,
	) {}

	build() {
		const data: ContinueRequestData = {
			requestId: this.requestId,
			url: this.url,
			method: this.method,
			headers: this.headers,
		};

		if (!this.body || !this.body.type) {
			return data;
		}

		let postData: string | null = null;
		let postDataType: string | null = null;

		switch (this.body.type) {
			case RequestBodyType.Text:
				postData = this.body.textValue;
				break;

			case RequestBodyType.UrlEncodedForm:
				postData = buildRequestBodyFromUrlEncodedForm(this.body.formValue);
				postDataType = 'application/x-www-form-urlencoded';
				break;

			case RequestBodyType.MultipartFromData:
				const boundary = '----NetifyFormBoundary' + randomHex(24);
				postData = buildRequestBodyFromMultipartForm(this.body.formValue, boundary);
				postDataType = 'multipart/form-data; boundary=' + boundary;
				break;
		}

		if (postData) {
			const contentLength = new TextEncoder().encode(postData).length.toString();
			const newHeaders = [{name: 'Content-Length', value: contentLength}];

			if (postDataType) {
				newHeaders.push({name: 'Content-Type', value: postDataType});
			}

			data.headers = patchHeaders(this.headers || [], newHeaders, []);
			data.postData = postData;
		}

		return data;
	}
}
