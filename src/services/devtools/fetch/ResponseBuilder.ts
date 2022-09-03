import {Protocol} from 'devtools-protocol';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
import {ResponseBody} from '@/interfaces/body';
import {LocalResponseRuleAction, MutationRuleAction} from '@/interfaces/rule';
import {patchHeaders} from './helpers/headers';
import {buildResponseBodyFromBase64, buildResponseBodyFromFile, buildResponseBodyFromText} from './helpers/response';

type RequestPausedEvent = Protocol.Fetch.RequestPausedEvent;
type FulfillRequestRequest = Protocol.Fetch.FulfillRequestRequest;
type HeaderEntry = Protocol.Fetch.HeaderEntry;

/**
 * Response handler provides processing the paused response to:
 *  - apply patch by a rule
 *  - transform to a breakpoint data and vise-versa - updated breakpoint data to a data for continue the request (FUTURE)
 *  This service also allows to get a continue request data from a local response data from the rule.
 */

export class ResponseBuilder {
	static asResponsePatch(pausedRequest: RequestPausedEvent, mutation: MutationRuleAction['response']) {
		const {requestId, responseStatusCode, responseHeaders} = pausedRequest;

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

	static asBreakpointExecute() {
		// TODO FUTURE
	}

	static compileBreakpoint() {
		// TODO FUTURE
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
