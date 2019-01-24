import {fromByteArray, toByteArray} from 'base64-js';
import {StatusCode} from '@/debugger/constants/StatusCode';
import {RequestHeaders} from '@/debugger/interfaces/chromeInternal';

// Todo separate functions to different files

export function compileRawResponseFromTextBody(statusCode: number, headers: RequestHeaders, bodyValue: string) {
	const bodyByteArray = new TextEncoder().encode(bodyValue);
	return compileRawResponseFromTypedArray(statusCode, headers, bodyByteArray);
}


export function compileRawResponseFromBase64Body(statusCode: number, headers: RequestHeaders, bodyValue: string) {
	const bodyByteArray = toByteArray(bodyValue);
	return compileRawResponseFromTypedArray(statusCode, headers, bodyByteArray);
}


export async function compileRawResponseFromBlobBody(statusCode: number, headers: RequestHeaders, bodyValue: Blob) {
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

	return compileRawResponseFromTypedArray(statusCode, headers, bodyByteArray);
}


function compileRawResponseFromTypedArray(statusCode: number, headers: RequestHeaders, bodyByteArray: Uint8Array) {
	// replace content-length header
	const finallyHeaders = replaceHeader(headers, 'Content-Length', bodyByteArray.length.toString());

	// build response status line with headers
	const baseString = compileResponseBase(statusCode, finallyHeaders);
	const baseByteArray = new TextEncoder().encode(baseString);

	// put together tho part of response to get response raw body as typed array
	const responseByteArray = new Uint8Array(baseByteArray.length + bodyByteArray.length);
	responseByteArray.set(baseByteArray);
	responseByteArray.set(bodyByteArray, baseByteArray.length);

	// transform to base64 and return
	return fromByteArray(responseByteArray);
}


/** Compiles base response part: status line, headers part and trail empty line*/
function compileResponseBase(statusCode: number, headers: RequestHeaders) {
	const statusLine = `HTTP/1.1 ${statusCode} ${StatusCode[statusCode]}`;
	const headersPart = Object.entries(headers).map(([key, value]) => key + ': ' + value).join('\n');
	return statusLine + '\n' + headersPart + '\n\n';
}


export function buildRequestBodyFromUrlEncodedForm(form: {key: string, value: string}[]) {
	return form
		.map(({key, value}: {key: string, value: string}) => {
			return encodeURIComponent(key) + '=' + encodeURIComponent(value);
		})
		.join('&');
}


export function buildRequestBodyFromMultipartForm(form: {key: string, value: string}[], boundary: string) {
	return form
		.map(({key, value}: {key: string, value: string}) => {
			return `${boundary}\nContent-Disposition: form-data; name="${key}"\n\n${value}`;
		})
		.join('\n\n') + '\n' + boundary;
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

function replaceHeader(headers: RequestHeaders, name: string, newValue: string) {
	const lowerCaseName = name.toLowerCase();
	const keyName = (Reflect.ownKeys(headers) as string[]).find(name => name.toLowerCase() === lowerCaseName);

	return {
		...headers,
		[keyName || name]: newValue,
	}
}
