import {fromByteArray, toByteArray} from 'base64-js';

export function parseTextBodyFromBase64(source: string) {
	const byteArray = toByteArray(source);
	return new TextDecoder().decode(byteArray);
}

export function parseBlobBodyFromBase64EncodedBody(source: string, fileName: string) {
	const byteArray = toByteArray(source);
	return new File([byteArray], fileName);
}

export function buildResponseBodyFromText(source: string) {
	const byteArray = new TextEncoder().encode(source);
	const value = fromByteArray(byteArray);
	const length = byteArray.length;

	return {value, length};
}

export function buildResponseBodyFromBase64(value: string) {
	const length = toByteArray(value).length;
	return {value, length};
}

export async function buildResponseBodyFromFile(source: File) {
	const reader = new FileReader();
	reader.readAsArrayBuffer(source);

	const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
		reader.onerror = () => {
			reject(reader.error);
		};

		reader.onloadend = () => {
			resolve(reader.result! as ArrayBuffer);
		};
	});

	const byteArray = new Uint8Array(arrayBuffer);
	const value = fromByteArray(byteArray);
	const length = byteArray.length;
	const type = source.type;

	return {value, length, type};
}
