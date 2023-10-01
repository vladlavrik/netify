import {toByteArray} from 'base64-js';
import {z} from 'zod';
import {RequestMethod, requestMethodsList} from '@/constants/RequestMethod';
import {ResponseErrorReason, responseErrorReasonsList} from '@/constants/ResponseErrorReason';
import type {Protocol} from 'devtools-protocol';

type RequestPausedEvent = Protocol.Fetch.RequestPausedEvent;
type ResponsePausedEvent = RequiredProps<RequestPausedEvent, 'responseStatusCode' | 'responseHeaders'>;

export const makeRequestScriptScope = ({request}: RequestPausedEvent) => {
	return {
		request: {
			url: request.url,
			method: request.method,
			headers: request.headers,
			postData: request.postData ? new Blob([request.postData]) : request.postData,
		},
	};
};

export const makeResponseScriptScope = (
	pausedResponse: ResponsePausedEvent,
	bodySource: {body: string; base64Encoded: boolean},
) => {
	const {request, responseStatusCode, responseHeaders} = pausedResponse;

	// Transform body from raw string or base64 encoded string to Blob
	let body;
	try {
		if (bodySource.body && !bodySource.base64Encoded) {
			body = new Blob([bodySource.body]);
		} else if (bodySource.body) {
			body = new Blob([toByteArray(bodySource.body)]);
		}
	} catch (error) {
		console.error(error);
	}

	return {
		response: {
			request: {
				url: request.url,
				method: request.method,
				headers: request.headers,
				postData: request.postData ? new Blob([request.postData]) : request.postData,
			},
			statusCode: responseStatusCode,
			headers: Object.fromEntries(responseHeaders.map(({name, value}) => [name, value])),
			body,
		},
	};
};

export const makeRequestScriptCode = (handlerCode: string) => {
	// language=js
	return `
		(function(){
			${handlerCode};

			/**
			 * @param {Object} requestPatch
			 * @param {string} [requestPatch.url]
			 * @param {string} [requestPatch.method]
			 * @param {Object} [requestPatch.headers]
			 * @param {string|Blob} [requestPatch.body]
			 */
			function next(requestPatch) {
				return {type: 'continue', patch: requestPatch};
			}

			/**
			 * @param {Object} response
			 * @param {number} [response.statusCode]
			 * @param {Object} [response.headers]
			 * @param {string|Blob} [response.body]
			 */
			next.response = function response(response) {
				return {type: 'response', response};
			};

			/**
			 * @param {string} [reason]
			 */
			next.failure = function failure(reason) {
				return {type: 'failure', reason};
			};
			
			return request(__scope__.request, next);
		})()
	`;
};

export const makeResponseScriptCode = (handlerCode: string) => {
	// language=js
	return `
		(function(){
			${handlerCode};

			/**
			 * @param {Object} responsePatch
			 * @param {number} [responsePatch.statusCode]
			 * @param {Object} [responsePatch.headers]
			 * @param {string|Blob} [responsePatch.body]
			 */
			function next(responsePatch) {
				return {
					patch: responsePatch,
				};
			}

			return response(__scope__.response, next);
		})()
	`;
};

/* eslint-disable @typescript-eslint/naming-convention */
// TODO improve error messages
export const requestScriptResultSchema = z.union(
	[
		z.object({
			type: z.literal('continue'),
			patch: z.object({
				url: z.string().url('Invalid endpoint url, must be a valid URL').optional(),
				method: z
					.nativeEnum(RequestMethod, {
						invalid_type_error: `Invalid method, must be a one of: ${requestMethodsList.join(', ')}`,
					})
					.optional(),
				headers: z
					.record(z.string(), {invalid_type_error: 'Invalid headers, must be a plain key-value object'})
					.optional(),
				body: z.string({invalid_type_error: 'Invalid body, must be a string'}).optional(),
			}),
		}),
		z.object({
			type: z.literal('response'),
			response: z.object({
				statusCode: z
					.number({invalid_type_error: 'Invalid status code, must be a number'})
					.min(100, 'Invalid status code, must be a number between 100 and 599')
					.max(599, 'Invalid status code, must be a number between 100 and 599')
					.default(200),
				headers: z
					.record(z.string(), {invalid_type_error: 'Invalid headers, must be a plain key-value object'})
					.default({}),
				body: z
					.union([z.string(), z.instanceof(Blob)], {
						invalid_type_error: 'Invalid body, must be a string or Blob',
					})
					.default(''),
			}),
		}),
		z.object({
			type: z.literal('failure', {invalid_type_error: 'Object must be returned!!!'}),
			reason: z
				.nativeEnum(ResponseErrorReason, {
					invalid_type_error: `Invalid fail reason, must be a one of: ${responseErrorReasonsList.join(', ')}`,
				})
				.default(ResponseErrorReason.Aborted),
		}),
	],
	{
		errorMap() {
			return {
				message:
					'Invalid script returned type, must be returned result of "next" function with object argument, e.g. "return next({ /* patch...*/})"',
			};
		},
	},
);

export const responseScriptResultSchema = z.object({
	patch: z.object({
		statusCode: z
			.number({invalid_type_error: 'Invalid status code, must be a number'})
			.min(100, 'Invalid status code, must be a number between 100 and 599')
			.max(599, 'Invalid status code, must be a number between 100 and 599')
			.optional(),
		headers: z
			.record(z.string(), {invalid_type_error: 'Invalid headers, must be a plain key-value object'})
			.optional(),
		body: z
			.union([z.string(), z.instanceof(Blob)], {invalid_type_error: 'Invalid body, must be a string or Blob'})
			.optional(),
	}),
});
/* eslint-enable @typescript-eslint/naming-convention */
