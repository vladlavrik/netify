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
