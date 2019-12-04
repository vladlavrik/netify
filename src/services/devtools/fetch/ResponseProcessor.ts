import {ResponseBodyType} from '@/constants/ResponseBodyType';
import {HeadersArray} from '@/interfaces/headers';
import {Rule} from '@/interfaces/rule';
import {ResponseBody} from '@/interfaces/body';
import {ResponseBreakpoint} from '@/interfaces/breakpoint';
import {FulfillRequestData, PausedResponseEventData} from './fetchProtocol';
import {parseTextBodyFromBase64, parseBlobBodyFromBase64EncodedBody, buildResponseBodyFromBase64, buildResponseBodyFromFile, buildResponseBodyFromText} from './helpers/response'; // prettier-ignore
import {patchHeaders} from './helpers/headers';
import {extractResponseContentType} from './helpers/contentType';

// TODO comments all methods and class
export class ResponseProcessor {
	static asResponsePatch({requestId, responseStatusCode, responseHeaders}: PausedResponseEventData, rule: Rule) {
		const mutation = rule.actions.mutate.response;

		let statusCode = responseStatusCode;
		if (mutation.statusCode !== null) {
			statusCode = mutation.statusCode;
		}

		let headers = patchHeaders(responseHeaders, mutation.headers.add, mutation.headers.remove);

		return new this(requestId, statusCode, headers, mutation.body);
	}

	static asLocalResponse(requestId: string, rule: Rule) {
		const {headers, body} = rule.actions.mutate.response;
		let {statusCode} = rule.actions.mutate.response;

		if (statusCode === null) {
			statusCode = 200;
		}

		return new this(requestId, statusCode, headers.add, body);
	}

	static asBreakpointExecute(response: ResponseBreakpoint) {
		return new this(response.requestId, response.statusCode, response.headers, response.body);
	}

	static compileBreakpoint(responseData: PausedResponseEventData, bodyData: string, bodyBase64Encoded: boolean) {
		const {requestId, request, responseHeaders, responseStatusCode} = responseData;

		const data: ResponseBreakpoint = {
			requestId,
			url: request.url,
			statusCode: responseStatusCode,
			headers: responseHeaders,
			body: {
				textValue: '',
			},
		};

		const contentTypeHeader = responseHeaders.find(({name}) => name.toLowerCase() === 'content-type');
		const bodyType = contentTypeHeader ? extractResponseContentType(contentTypeHeader.value) : null;

		if (!bodyData && !bodyType) {
			return data;
		}

		if (!bodyData || !bodyBase64Encoded) {
			data.body.type = ResponseBodyType.Text;
			data.body.textValue = bodyData;
			return data;
		}

		if (bodyType === ResponseBodyType.Text) {
			data.body.type = ResponseBodyType.Text;
			data.body.textValue = parseTextBodyFromBase64(bodyData);
			return data;
		}

		data.body.type = ResponseBodyType.File;
		data.body.fileValue = parseBlobBodyFromBase64EncodedBody(bodyData, 'response.file'); // TODO add parsed extension

		return data;
	}

	private constructor(
		private readonly requestId: string,
		private readonly statusCode: number,
		private readonly headers: HeadersArray,
		private readonly body?: ResponseBody,
	) {}

	async build() {
		const data: FulfillRequestData = {
			requestId: this.requestId,
			responseHeaders: this.headers,
			responseCode: this.statusCode,
		};

		if (!this.body || !this.body.type) {
			return data;
		}

		let newBody: {value: string; length: number; type?: string} | null = null;
		switch (this.body.type) {
			case ResponseBodyType.Text:
				newBody = buildResponseBodyFromText(this.body.textValue);
				break;

			case ResponseBodyType.Base64:
				newBody = buildResponseBodyFromBase64(this.body.textValue);
				break;

			case ResponseBodyType.File:
				if (this.body.fileValue) {
					newBody = await buildResponseBodyFromFile(this.body.fileValue);
				}
				// not defined file is equal to an empty body
				break;
		}

		if (newBody) {
			const newHeaders = [{name: 'Content-Length', value: newBody.length.toString()}];
			if (newBody.type) {
				newHeaders.push({name: 'Content-Type', value: newBody.type});
			}

			data.body = newBody.value;
			data.responseHeaders = patchHeaders(data.responseHeaders, newHeaders, []);
		}

		return data;
	}
}
