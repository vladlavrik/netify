import {Protocol} from 'devtools-protocol';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
import {ResponseBody} from '@/interfaces/body';
import {ResponseBreakpointInput} from '@/interfaces/breakpoint';
import {HeadersArray} from '@/interfaces/headers';
import {LocalResponseRuleAction, MutationRuleAction} from '@/interfaces/rule';
import {headersMapToArray, patchHeaders} from './helpers/headers';
import {
	buildResponseBodyFromBase64,
	buildResponseBodyFromFile,
	buildResponseBodyFromText,
	parseBlobBodyFromBase64EncodedBody,
	parseTextBodyFromBase64,
} from './helpers/response';

type FulfillRequestRequest = Protocol.Fetch.FulfillRequestRequest;
type HeaderEntry = Protocol.Fetch.HeaderEntry;
type RequestPausedEvent = Protocol.Fetch.RequestPausedEvent;

export type ResponsePausedEvent = RequiredProps<RequestPausedEvent, 'responseStatusCode' | 'responseHeaders'>;

/**
 * Response handler provides processing the paused response to:
 *  - apply patch by a rule
 *  - transform to a breakpoint data and vise-versa - updated breakpoint data to a data for continue the request (FUTURE)
 *  This service also allows to get a continue request data from a local response data from the rule.
 */

export class ResponseBuilder {
	static asResponsePatch(pausedResponse: ResponsePausedEvent, mutation: MutationRuleAction['response']) {
		const {requestId, responseStatusCode, responseHeaders} = pausedResponse;

		let statusCode = responseStatusCode!;
		if (mutation.statusCode) {
			statusCode = mutation.statusCode;
		}

		const headers = patchHeaders(responseHeaders!, mutation.setHeaders, mutation.dropHeaders);

		return new this(requestId, statusCode, headers, mutation.body);
	}

	static asLocalResponse(requestId: string, action: LocalResponseRuleAction) {
		const {statusCode, headers, body} = action;
		return new this(requestId, statusCode, headers, body);
	}

	static asScriptResult(
		pausedRequest: RequestPausedEvent,
		response: {statusCode?: number; headers?: Record<string, any>; body?: string | Blob},
	) {
		const statusCode = response.statusCode ?? pausedRequest.responseStatusCode ?? 200;
		const headers = response.headers ? headersMapToArray(response.headers) : pausedRequest.responseHeaders || [];

		let body: ResponseBody | undefined;
		if (response.body) {
			if (response.body instanceof Blob) {
				body = {
					type: ResponseBodyType.File,
					value: response.body instanceof File ? response.body : new File([response.body], 'filename'),
				};
			} else {
				body = {
					type: ResponseBodyType.Text,
					value: response.body,
				};
			}
		}

		return new this(pausedRequest.requestId, statusCode, headers, body);
	}

	static asBreakpointExecute(
		requestId: string,
		{statusCode, headers, body}: {statusCode: number; headers: HeadersArray; body: ResponseBody},
	) {
		return new this(requestId, statusCode, headers, body);
	}

	static compileBreakpoint(
		pausedResponse: ResponsePausedEvent,
		bodySource: string,
		base64Encoded: boolean,
	): ResponseBreakpointInput {
		const {request, responseHeaders, responseStatusCode} = pausedResponse;
		let body: ResponseBody | undefined;
		const contentType = //
			new Headers(responseHeaders.map<[string, string]>(({name, value}) => [name, value])).get('content-type');

		if (!bodySource) {
			body = {
				type: ResponseBodyType.Text,
				value: '',
			};
		} else if (!base64Encoded) {
			body = {
				type: ResponseBodyType.Text,
				value: bodySource,
			};
		} else if (contentType && (contentType.startsWith('text/') || contentType.startsWith('application/json'))) {
			try {
				body = {
					type: ResponseBodyType.Text,
					value: parseTextBodyFromBase64(bodySource),
				};
			} catch (error) {
				console.error(error);
			}
		}

		if (!body) {
			const fileName = new URL(request.url).pathname.split('/').pop() || 'response';
			body = {
				type: ResponseBodyType.File,
				value: parseBlobBodyFromBase64EncodedBody(bodySource, fileName),
			};
		}

		return {
			url: request.url,
			statusCode: responseStatusCode,
			headers: responseHeaders,
			body,
		};
	}

	private constructor(
		private readonly requestId: string,
		private readonly statusCode: number,
		private readonly headers: HeaderEntry[],
		private readonly body?: ResponseBody,
	) {}

	async build() {
		const data: FulfillRequestRequest = {
			requestId: this.requestId,
			responseHeaders: this.headers,
			responseCode: this.statusCode,
		};

		if (!this.body) {
			return data;
		}

		let newBody: {value: string; length: number; type?: string} | undefined;

		switch (this.body.type) {
			case ResponseBodyType.Text:
			case ResponseBodyType.JSON:
				newBody = buildResponseBodyFromText(this.body.value);
				break;

			case ResponseBodyType.Base64:
				newBody = buildResponseBodyFromBase64(this.body.value);
				break;

			case ResponseBodyType.File:
				if (this.body.value) {
					newBody = await buildResponseBodyFromFile(this.body.value);
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
			data.responseHeaders = patchHeaders(data.responseHeaders!, newHeaders, []);
		}

		return data;
	}
}
