export function buildRequestBodyFromUrlEncodedForm(form: {key: string; value: string}[]) {
	return form
		.map(({key, value}: {key: string; value: string}) => {
			return encodeURIComponent(key) + '=' + encodeURIComponent(value);
		})
		.join('&');
}

export function buildRequestBodyFromMultipartForm(form: {key: string; value: string}[], boundary: string) {
	return (
		form
			.map(({key, value}: {key: string; value: string}) => {
				return `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`;
			})
			.join('') + `--${boundary}--\r\n`
	);
}

export function parseUrlEncodedForm(source: string): {key: string; value: string}[] {
	return source.split('&').map(section => {
		const [name, value] = section.split('=');
		return {
			key: decodeURIComponent(name),
			value: decodeURIComponent(value || ''),
		};
	});
}

// Supports only text forms (without blob fields),
// because chrome devtools protocol do not send "postData" when it contents blob data now
// TODO add support of blob data and multiple file per row files (with <filed name>[])
export function parseMultipartForm(source: string, boundary: string): {key: string; value: string}[] {
	const nameRegExp = /content-disposition.+?name="(.+?)"/i;

	return  source
		.split(`--${boundary}--\r\n`)[0] // split by form end delimiter and clip content after
		.split(`--${boundary}\r\n`) // split by field boundary
		.slice(1) // clip first (trash before form data)
		.map(group => {
			const headersEnd = group.indexOf('\r\n\r\n');
			const headers = group.slice(0, headersEnd);
			const content = group.slice(headersEnd + 4 /* delimiter length */, -2 /* end delimiter length */);

			// Extract a name value
			const [, name = ''] = headers.match(nameRegExp) || [];
			return {
				key: name,
				value: content,
			};
		});
}

export function extractMultipartFormBoundary(contentType: string) {
	const headerParts = contentType.split(';');

	for (const part of headerParts) {
		const [key, value] = part.split('=');
		if (key.trim().toLowerCase() === 'boundary') {
			return value;
		}
	}

	return;
}
