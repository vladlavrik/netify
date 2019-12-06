import {RequestMethod} from '@/constants/RequestMethod';
import {RequestBodyType} from '@/constants/RequestBodyType';
import {HeadersArray} from '@/interfaces/headers';
import {MutationAction} from '@/interfaces/rule';
import {RequestBody} from '@/interfaces/body';
import {randomHex} from '@/helpers/random';
import {compileUrlFromPattern} from './helpers/url';
import {headersMapToArray, patchHeaders} from './helpers/headers';
import {buildRequestBodyFromMultipartForm, buildRequestBodyFromUrlEncodedForm} from './helpers/forms';
import {ContinueRequestData, PausedRequestEventData} from './fetchProtocol';

// TODO comments all methods and class
export class RequestBuilder {
	static asRequestPatch({request, requestId}: PausedRequestEventData, action: MutationAction) {
		const patch = action.request;

		// rewrite request params before send to server
		let url;
		if (patch.endpoint) {
			url = compileUrlFromPattern(patch.endpoint, request.url);
		}

		// ignore new method is it the same as original
		let method;
		if (patch.method && patch.method !== request.method) {
			method = patch.method;
		}

		// then, patch headers list
		let headers;
		if (patch.headers.add.length || patch.headers.remove.length) {
			const initial = headersMapToArray(request.headers);
			const {add, remove} = patch.headers;
			headers = patchHeaders(initial, add, remove);
		}

		return new this(requestId, url, method, headers, patch.body);
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
