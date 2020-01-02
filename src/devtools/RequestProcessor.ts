import {randomHex} from '@/helpers/random';
import {RequestMethod} from '@/constants/RequestMethod';
import {RequestBodyType} from '@/constants/RequestBodyType';
import {HeadersArray} from '@/interfaces/headers';
import {PausedRequest} from '@/interfaces/request';
import {Rule} from '@/interfaces/rule';
import {RequestBody} from '@/interfaces/body';
import {ContinueRequestData, PausedRequestEventData} from './chrome/devtoolsProtocol';
import {compileUrlFromPattern} from './http/url';
import {headersMapToArray, patchHeaders} from './http/headers';
import {extractRequestContentType} from './http/contentType';
import {buildRequestBodyFromMultipartForm, buildRequestBodyFromUrlEncodedForm, parseUrlEncodedForm} from './http/forms';

export class RequestProcessor {
	static asRequestPatch({request, requestId}: PausedRequestEventData, rule: Rule) {
		const mutation = rule.actions.mutate.request;

		// Rewrite request params before send to server
		let url;
		if (mutation.endpoint) {
			url = compileUrlFromPattern(mutation.endpoint, request.url);
		}

		// Then, rewrite request method
		let method;
		if (mutation.method && mutation.method !== request.method) {
			method = mutation.method;
		}

		// Then, patch headers list
		let headers;
		if (mutation.headers.add.length || mutation.headers.remove.length) {
			const initial = headersMapToArray(request.headers);
			const {add, remove} = mutation.headers;
			headers = patchHeaders(initial, add, remove);
		}

		// Todo body desc
		let body;
		if (mutation.body.type !== 'Original') {
			body = (mutation.body as any) as RequestBody;
		}

		return new this(requestId, url, method, headers, body);
	}

	static asBreakpointExecute({requestId, url, method, headers, body}: PausedRequest) {
		return new this(requestId, url, method, headers, body);
	}

	static compilePausedRequest(requestData: PausedRequestEventData) {
		const {
			requestId,
			request: {url, method, headers, postData},
		} = requestData;

		const data: PausedRequest = {
			requestId,
			url,
			method,
			headers: headersMapToArray(headers),
		};

		const headerKeys = Reflect.ownKeys(headers) as string[];
		const contentTypeHeader = headerKeys.find(name => name.toLowerCase() === 'content-type');
		const bodyType = contentTypeHeader ? extractRequestContentType(headers[contentTypeHeader]) : null;

		if (!postData && !bodyType) {
			return data;
		}

		switch (bodyType) {
			case RequestBodyType.Text:
				data.body = {
					type: bodyType,
					textValue: postData || '',
					formValue: [],
				};
				return data;

			case RequestBodyType.UrlEncodedForm:
			case RequestBodyType.MultipartFromData:
				// Attention: postData is lost when MultipartFromData contains a blob data
				data.body = {
					type: bodyType,
					textValue: '',
					formValue: postData ? parseUrlEncodedForm(postData) : [],
				};
				return data;

			default:
				// Content like a blob, but it also can be a text
				// Attention: postData is lost content is blob
				if (postData) {
					data.body = {
						type: RequestBodyType.Text,
						textValue: '',
						formValue: [],
					};
				}
				return data;
		}
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

		if (!this.body) {
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
				const boundary = `----NetifyFormBoundary${randomHex(24)}`;
				postData = buildRequestBodyFromMultipartForm(this.body.formValue, boundary);
				postDataType = `multipart/form-data; boundary=${boundary}`;
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
