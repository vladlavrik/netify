import {fromByteArray, toByteArray} from 'base64-js';
import {StatusCode} from '@/debugger/constants/StatusCode';
import {RequestBodyType} from '@/debugger/constants/RequestBodyType';
import {RequestHeaders} from '@/debugger/interfaces/chromeInternal';


export function compileRawResponseFromTextBody(statusCode: number, headers: RequestHeaders, bodyValue: string) {
	const responseString = compileResponseBase(statusCode, headers) + bodyValue;
	const responseByteArray = new TextEncoder().encode(responseString);
	return fromByteArray(responseByteArray);
}

export function compileRawResponseFromBase64Body(statusCode: number, headers: RequestHeaders, bodyValue: string) {
	const baseString = compileResponseBase(statusCode, headers);
	const baseByteArray = new TextEncoder().encode(baseString);

	const bodyByteArray = toByteArray(bodyValue);

	const responseByteArray = new Uint8Array(baseByteArray.length + bodyByteArray.length);
	responseByteArray.set(baseByteArray);
	responseByteArray.set(bodyByteArray, baseByteArray.length);

	return fromByteArray(responseByteArray);
}

export async function compileRawResponseFromBlobBody(statusCode: number, headers: RequestHeaders, bodyValue: Blob) {
	const baseString = compileResponseBase(statusCode, headers);
	const baseByteArray = new TextEncoder().encode(baseString);

	const reader = new FileReader();
	reader.readAsArrayBuffer(bodyValue);

	const bodyArrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
		reader.onerror = () => {
			reject(reader.error);
		};

		reader.onloadend = () => {
			resolve(reader.result! as ArrayBuffer);
		};
	});

	const bodyByteArray = new Uint8Array(bodyArrayBuffer);
	const responseByteArray = new Uint8Array(baseByteArray.length + bodyByteArray.length);
	responseByteArray.set(baseByteArray);
	responseByteArray.set(bodyByteArray, baseByteArray.length);

	return fromByteArray(responseByteArray);
}

/** Compiles base response part: status line, headers part and trail empty line*/
function compileResponseBase(statusCode: number, headers: RequestHeaders) {
	const statusLine = `HTTP/1.1 ${statusCode} ${StatusCode[statusCode]}`;
	const headersPart = Object.entries(headers).map(([key, value]) => key + ': ' + value).join('\n');
	return statusLine + '\n' + headersPart + '\n\n';
}

export async function bodyToString(type: RequestBodyType, value: Blob | string): Promise<string> {
	switch (type) {
		case RequestBodyType.Text:
			return value as string;

		case RequestBodyType.Base64:
			return atob(value as string);

		case RequestBodyType.Blob: {
			const reader = new FileReader();

			reader.readAsText(value as Blob);

			return await new Promise((resolve, reject) => {
				reader.onerror = () => {
					reject(reader.error);
				};

				reader.onloadend = () => {
					resolve(reader.result! as string);
				};
			});
		}
	}
}

export function mutateHeaders(originalHeaders: RequestHeaders, toAdd: RequestHeaders, toRemove: string[]) {
	const finallyHeaders = {...originalHeaders};

	const toRemoveSet = new Set([...toRemove, ...Reflect.ownKeys(toAdd)].map((item => (item as string).toLowerCase())));

	// first clean headers to remove it and rewritable (remove addable to avoid the same headers with different cases)
	for (const key of Reflect.ownKeys(finallyHeaders) as string[]) {
		if (toRemoveSet.has(key.toLowerCase())) {
			delete finallyHeaders[key];
		}
	}

	// then add new headers
	Object.assign(finallyHeaders, toAdd);

	return finallyHeaders;
}
