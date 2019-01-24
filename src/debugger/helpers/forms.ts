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

