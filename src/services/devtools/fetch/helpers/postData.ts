import {fromByteArray} from 'base64-js';

const textToBase64 = (source: string) => {
	const byteArray = new TextEncoder().encode(source);
	return fromByteArray(byteArray);
};

export function buildRequestBodyFromText(source: string) {
	return textToBase64(source);
}

export function buildRequestBodyFromUrlEncodedForm(form: {key: string; value: string}[]) {
	const textSource = form
		.map(({key, value}: {key: string; value: string}) => {
			return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
		})
		.join('&');

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

export function parseUrlEncodedForm(source: string): {key: string; value: string}[] {
	return source.split('&').map((section) => {
		const [name, value] = section.split('=');
		return {
			key: decodeURIComponent(name),
			value: decodeURIComponent(value || ''),
		};
	});
}
