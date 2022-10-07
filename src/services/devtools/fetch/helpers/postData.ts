import {fromByteArray} from 'base64-js';

const textToBase64 = (source: string) => {
	const byteArray = new TextEncoder().encode(source);
	return fromByteArray(byteArray);
};

export function buildRequestBodyFromText(source: string) {
	return textToBase64(source);
}

export function buildRequestBodyFromUrlEncodedForm(form: {key: string; value: string}[]) {
	const textSource = new URLSearchParams(form.reduce((map, {key, value}) => ({...map, [key]: value}), {})).toString();
	return textToBase64(textSource);
}

export function buildRequestBodyFromMultipartForm(form: {key: string; value: string}[], boundary: string) {
	const data = form
		.map(({key, value}: {key: string; value: string}) => {
			return `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`;
		})
		.join('');

	return textToBase64(`${data}--${boundary}--\r\n`);
}

export function parseUrlEncodedForm(source: string) {
	return Array.from(new URLSearchParams(source).entries()).map(([key, value]) => ({key, value}));
}

const multipartFormHeader = /\r\ncontent-disposition: ?form-data; ?name="(.+?)"\r\n\r\n+/i;

export function parseUrlMultipartForm(source: string, boundary: string) {
	return source
		.split(`--${boundary}`)
		.map((part) => {
			const parseResult = multipartFormHeader.exec(part);
			if (!parseResult) {
				return undefined;
			}
			const [totalMatched, key] = parseResult;

			const value = part.substring(totalMatched.length, part.length - 1);

			return {key, value};
		})
		.filter(Boolean) as {key: string; value: string}[];
}
