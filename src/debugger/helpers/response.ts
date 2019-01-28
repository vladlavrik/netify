import {fromByteArray, toByteArray} from 'base64-js';
import {StatusCode} from '@/constants/StatusCode';
import {RequestHeaders} from '@/debugger/chromeInternal';
import {replaceHeader} from './headers';

export function compileRawResponseFromTextBody(statusCode: number, headers: RequestHeaders, bodyValue: string) {
	const bodyByteArray = new TextEncoder().encode(bodyValue);
	return compileRawResponseFromTypedArray(statusCode, headers, bodyByteArray);
}

export function compileRawResponseFromBase64Body(statusCode: number, headers: RequestHeaders, bodyValue: string) {
	const bodyByteArray = toByteArray(bodyValue);
	return compileRawResponseFromTypedArray(statusCode, headers, bodyByteArray);
}

export async function compileRawResponseFromFileBody(statusCode: number, headers: RequestHeaders, bodyValue: File) {
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

	let updatedHeaders = headers;
	if (bodyValue.type) {
		updatedHeaders = replaceHeader(headers, 'Content-Type', bodyValue.type);
	}

	return compileRawResponseFromTypedArray(statusCode, updatedHeaders, bodyByteArray);
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
	const headersPart = Object.entries(headers)
		.map(([key, value]) => key + ': ' + value)
		.join('\n');

	return statusLine + '\n' + headersPart + '\n\n';
}
