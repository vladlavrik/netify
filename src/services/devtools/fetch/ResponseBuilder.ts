import {ResponseBodyType} from '@/constants/ResponseBodyType';
import {HeadersArray} from '@/interfaces/headers';
import {MutationAction, LocalResponseAction} from '@/interfaces/rule';
import {ResponseBody} from '@/interfaces/body';
import {buildResponseBodyFromBase64, buildResponseBodyFromFile, buildResponseBodyFromText} from './helpers/response';
import {patchHeaders} from './helpers/headers';
import {FulfillRequestData, PausedResponseEventData} from './fetchProtocol';

// TODO comments all methods and class
export class ResponseBuilder {
	static asResponsePatch(response: PausedResponseEventData, action: MutationAction) {
		const {requestId} = response;
		const mutation = action.response;

		let statusCode = response.responseStatusCode;
		if (mutation.statusCode !== null) {
			statusCode = mutation.statusCode;
		}

		let headers = patchHeaders(response.responseHeaders, mutation.headers.add, mutation.headers.remove);

		return new this(requestId, statusCode, headers, mutation.body);
	}

	static asLocalResponse(requestId: string, action: LocalResponseAction) {
		const {statusCode, headers, body} = action;
		return new this(requestId, statusCode, headers, body);
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
