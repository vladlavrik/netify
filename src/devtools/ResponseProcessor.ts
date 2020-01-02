import {ResponseBodyType} from '@/constants/ResponseBodyType';
import {HeadersArray} from '@/interfaces/headers';
import {Rule} from '@/interfaces/rule';
import {ResponseBody} from '@/interfaces/body';
import {PausedResponse} from '@/interfaces/request';
import {FulfillRequestData, PausedResponseEventData} from './chrome/devtoolsProtocol';
import {buildResponseBodyFromBase64, buildResponseBodyFromFile, buildResponseBodyFromText, parseBlobBodyFromBase64EncodedBody} from './http/response'; // prettier-ignore
import {patchHeaders} from './http/headers';
import {extractResponseContentType} from './http/contentType';

// TODO comments all methods
export class ResponseProcessor {
	static asResponsePatch({requestId, responseStatusCode, responseHeaders}: PausedResponseEventData, rule: Rule) {
		const mutation = rule.actions.mutate.response;

		let statusCode = responseStatusCode;
		if (mutation.statusCode !== null) {
			statusCode = mutation.statusCode;
		}

		const headers = patchHeaders(responseHeaders, mutation.headers.add, mutation.headers.remove);

		let body;
		if (mutation.body.type !== 'Original') {
			body = (mutation.body as any) as ResponseBody;
		}

		return new this(requestId, statusCode, headers, body);
	}

	static asLocalResponse(requestId: string, rule: Rule) {
		const {headers, body} = rule.actions.mutate.response;
		let {statusCode} = rule.actions.mutate.response;

		if (statusCode === null) {
			statusCode = 200;
		}

		let bodyValue;
		if (body.type !== 'Original') {
			bodyValue = (body as any) as ResponseBody;
		}

		return new this(requestId, statusCode, headers.add, bodyValue);
	}

	static asBreakpointExecute(response: PausedResponse) {
		return new this(response.requestId, response.statusCode, response.headers, response.body);
	}

	static compilePausedResponse(responseData: PausedResponseEventData, bodyData: string, bodyBase64Encoded: boolean) {
		const {requestId, responseHeaders, responseStatusCode} = responseData;

		const data: PausedResponse = {
			requestId,
			statusCode: responseStatusCode,
			headers: responseHeaders,
		};

		const contentTypeHeader = responseHeaders.find(({name}) => name.toLowerCase() === 'content-type');
		const bodyType = contentTypeHeader ? extractResponseContentType(contentTypeHeader.value) : null;

		if (!bodyData && !bodyType) {
			return data;
		}

		if (!bodyData || !bodyBase64Encoded) {
			data.body = {type: ResponseBodyType.Text, textValue: bodyData};
			return data;
		}

		data.body = {
			type: ResponseBodyType.File,
			textValue: '',
			fileValue: parseBlobBodyFromBase64EncodedBody(bodyData, 'body'), // TODO add parsed extension
		};

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

		if (!this.body) {
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
				// Not defined file is equal to an empty body
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
