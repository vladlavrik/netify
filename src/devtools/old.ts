// Import {Rule} from '@/interfaces/Rule';
// Import {ResponseBodyType} from '@/constants/ResponseBodyType';
// Import {ContinueRequestParams, GetInterceptedBodyResponse, CompletedRequestEventParams} from './chrome/interfaces';
// Import {compileRawResponseFromBase64Body, compileRawResponseFromFileBody, compileRawResponseFromTextBody} from './http/response'; // prettier-ignore
// Import {mutateHeaders} from './http/headers';
// Import {sendDebuggerCommand} from './chrome/chromeAPI';

// Import {Rule} from '@/interfaces/Rule';
// Import {ResponseBodyType} from '@/constants/ResponseBodyType';
// Import {RequestBodyType} from '@/constants/RequestBodyType';
// Import {randomHex} from '@/helpers/random';
// Import {ContinueRequestParams, RequestEventParams, Request} from './chrome/interfaces';
// Import {compileRawResponseFromBase64Body, compileRawResponseFromFileBody, compileRawResponseFromTextBody} from './http/response'; // prettier-ignore
// Import {buildRequestBodyFromMultipartForm, buildRequestBodyFromUrlEncodedForm} from './http/forms';
// Import {compileUrlFromPattern} from './http/url';
// Import {mutateHeaders} from './http/headers';

export class ResponseProcessor {
	constructor(_debugTarget: chrome.debugger.Debuggee & {tabId: number}) {}

	/* Async process(interceptEvent: CompletedRequestEventParams, rule: Rule): Promise<ContinueRequestParams> {
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
	}*/

	/* Async process({interceptionId, request}: RequestEventParams, rule: Rule): Promise<ContinueRequestParams> {
		const {mutateRequest, mutateResponse, cancelRequest} = rule.actions;

		// is defined response error and required local response, return error reason on the request stage
		if (cancelRequest.enabled) {
			return {interceptionId, errorReason: cancelRequest.reason};
		}

		// if required local response, combine the response form defined status, headers and body
		if (mutateResponse.enabled && mutateResponse.responseLocally) {
			return await this.buildLocalResponse(interceptionId, rule);
		}

		if (mutateRequest.enabled) {
			return await this.buildRequestPatch(interceptionId, request, rule);
		}

		return {interceptionId};
	}

	// noinspection JSMethodCanBeStatic
	private async buildLocalResponse(interceptionId: string, {actions: {mutateResponse}}: Rule) {
		const {statusCode: rawStatusCode, headers, bodyReplace} = mutateResponse;
		const statusCode = rawStatusCode || 200;

		let rawResponse;
		switch (bodyReplace.type) {
			case ResponseBodyType.Original:
				rawResponse = compileRawResponseFromTextBody(statusCode, headers.add, '');
				break;

			case ResponseBodyType.Text:
				rawResponse = compileRawResponseFromTextBody(statusCode, headers.add, bodyReplace.textValue);
				break;

			case ResponseBodyType.Base64:
				rawResponse = compileRawResponseFromBase64Body(statusCode, headers.add, bodyReplace.textValue);
				break;

			case ResponseBodyType.File:
				rawResponse = bodyReplace.fileValue
					? await compileRawResponseFromFileBody(statusCode, headers.add, bodyReplace.fileValue)
					: compileRawResponseFromTextBody(statusCode, headers.add, ''); // not defined file is equal ro an empty body
				break;
		}

		return {interceptionId, rawResponse};
	}

	// noinspection JSMethodCanBeStatic
	private async buildRequestPatch(interceptionId: string, request: Request, {actions: {mutateRequest}}: Rule) {
		const continueParams: ContinueRequestParams = {interceptionId};

		// rewrite request params before send to server
		// first, rewrite endpoint url
		if (mutateRequest.endpointReplace) {
			continueParams.url = compileUrlFromPattern(mutateRequest.endpointReplace, request.url);
		}

		// then, rewrite request method
		if (mutateRequest.methodReplace) {
			continueParams.method = mutateRequest.methodReplace;
		}

		// then, mutate headers
		if (Reflect.ownKeys(mutateRequest.headers.add).length || mutateRequest.headers.remove.length) {
			const {add, remove} = mutateRequest.headers;
			continueParams.headers = mutateHeaders(request.headers, add, remove);
		}

		// then, rewrite body
		if (mutateRequest.bodyReplace.type !== RequestBodyType.Original) {
			const {type, textValue, formValue} = mutateRequest.bodyReplace;
			let contentType = 'text/plain;charset=UTF-8';

			switch (type) {
				case RequestBodyType.Text:
					continueParams.postData = textValue;
					break;

				case RequestBodyType.UrlEncodedForm:
					continueParams.postData = buildRequestBodyFromUrlEncodedForm(formValue);
					contentType = 'application/x-www-form-urlencoded';
					break;

				case RequestBodyType.MultipartFromData:
					const boundary = '----NetifyFormBoundary' + randomHex(24);
					continueParams.postData = buildRequestBodyFromMultipartForm(formValue, boundary);
					contentType = 'multipart/form-data; boundary=' + boundary;
					break;
			}

			// calculate post data length in octets (bytes)
			const contentLength = new TextEncoder().encode(continueParams.postData).length.toString();

			continueParams.headers = mutateHeaders(
				continueParams.headers || request.headers,
				{
					'Content-Type': contentType,
					'Content-Length': contentLength,
				},
				[],
			);
		}

		return continueParams;
	}*/
}
