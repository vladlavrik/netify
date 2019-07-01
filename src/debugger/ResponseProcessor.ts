import {Rule} from '@/interfaces/Rule';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
import {ContinueRequestParams, GetInterceptedBodyResponse, CompletedRequestEventParams} from './chrome/interfaces';
import {compileRawResponseFromBase64Body, compileRawResponseFromFileBody, compileRawResponseFromTextBody} from './http/response'; // prettier-ignore
import {mutateHeaders} from './http/headers';
import {sendDebuggerCommand} from './chrome/chromeAPI';

export class ResponseProcessor {
	constructor(private debugTarget: chrome.debugger.Debuggee & {tabId: number}) {}

	async process(interceptEvent: CompletedRequestEventParams, rule: Rule): Promise<ContinueRequestParams> {
		const {interceptionId, responseStatusCode, responseHeaders} = interceptEvent;
		const {mutateResponse} = rule.actions;

		const skipHandler =
			mutateResponse.statusCode === null &&
			Reflect.ownKeys(mutateResponse.headers.add).length === 0 &&
			mutateResponse.headers.remove.length === 0 &&
			mutateResponse.bodyReplace.type === ResponseBodyType.Original;

		if (!mutateResponse.enabled || skipHandler) {
			return {interceptionId};
		}

		// define status code
		let newStatusCode = mutateResponse.statusCode === null ? responseStatusCode : mutateResponse.statusCode;

		// defined mutated headers
		const newHeaders = mutateHeaders(responseHeaders, mutateResponse.headers.add, mutateResponse.headers.remove);

		// TODO maybe handle response without full rebuild if body not changed

		// define response body from the rules or extract from the server response
		let newBodyType;
		let newBodyTextValue;
		let newBodyFileValue: File | undefined;
		if (mutateResponse.bodyReplace.type !== ResponseBodyType.Original) {
			newBodyType = mutateResponse.bodyReplace.type;
			newBodyTextValue = mutateResponse.bodyReplace.textValue;
			newBodyFileValue = mutateResponse.bodyReplace.fileValue;
		} else {
			const {body, base64Encoded} = await sendDebuggerCommand<GetInterceptedBodyResponse>(
				this.debugTarget,
				'Network.getResponseBodyForInterception',
				{interceptionId},
			);
			newBodyType = base64Encoded ? ResponseBodyType.Base64 : ResponseBodyType.Text;
			newBodyTextValue = await body;
		}

		// combine rawResponse from new body, old and new headers, and status code
		let rawResponse;
		switch (newBodyType) {
			case ResponseBodyType.Text:
				rawResponse = compileRawResponseFromTextBody(newStatusCode, newHeaders, newBodyTextValue);
				break;

			case ResponseBodyType.Base64:
				rawResponse = compileRawResponseFromBase64Body(newStatusCode, newHeaders, newBodyTextValue);
				break;

			case ResponseBodyType.File:
				rawResponse = newBodyFileValue
					? await compileRawResponseFromFileBody(newStatusCode, newHeaders, newBodyFileValue)
					: compileRawResponseFromTextBody(newStatusCode, newHeaders, ''); // not defined file is equal to an empty body
				break;
		}

		return {interceptionId, rawResponse};
	}
}
