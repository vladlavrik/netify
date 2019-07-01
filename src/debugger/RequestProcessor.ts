import {Rule} from '@/interfaces/Rule';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
import {RequestBodyType} from '@/constants/RequestBodyType';
import {randomHex} from '@/helpers/random';
import {ContinueRequestParams, RequestEventParams, Request} from './chrome/interfaces';
import {compileRawResponseFromBase64Body, compileRawResponseFromFileBody, compileRawResponseFromTextBody} from './http/response'; // prettier-ignore
import {buildRequestBodyFromMultipartForm, buildRequestBodyFromUrlEncodedForm} from './http/forms';
import {compileUrlFromPattern} from './http/url';
import {mutateHeaders} from './http/headers';

export class RequestProcessor {
	constructor() {}

	async process({interceptionId, request}: RequestEventParams, rule: Rule): Promise<ContinueRequestParams> {
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
	}
}
