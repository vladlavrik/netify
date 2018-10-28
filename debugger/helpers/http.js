import statusCodes from '../constants/statusCodes.js';

/**
 *
 * @param {number} statusCode
 * @param {Object} headers
 * @param {'empty'|'text'|'base64'|'blob'} bodyType
 * @param {Blob|string|null} bodyValue
 */
export function compileRawResponse(statusCode, headers, bodyType, bodyValue) {
	const statusLine = `HTTP/1.1 ${statusCode} ${statusCodes[statusCode]}`;
	const headersPart = Object.entries(headers)
		.map(([key, value]) => {
			return key + ': ' + value
		})
		.join('\n');

	let bodyBlob;
	switch (bodyType) {
		case 'empty':
			break;

		case 'text':
			bodyBlob = new Blob([bodyValue]);
			break;

		case 'base64':
			bodyBlob = new Blob([atob(bodyValue)]);
			break;

		case 'blob':
			bodyBlob = bodyValue;
			break;
	}

	const resultBlob = new Blob([
		statusLine + '\n' + headersPart + '\n\n',
		bodyBlob,
	], {type: 'text/plain'});


	const reader = new FileReader();
	reader.readAsDataURL(resultBlob);

	return new Promise(resolve => {
		// TODO handle error
		reader.onloadend = () => {
			resolve(reader.result.split('data:text/plain;base64,')[1]);
		};
	});
}


/**
 *
 * @param {Object} originalHeaders
 * @param {Object} toAdd
 * @param {string[]} toRemove
 */
export function mutateHeaders(originalHeaders, toAdd, toRemove) {
	const finallyHeaders = {...originalHeaders};

	const toRemoveSet = new Set([...toRemove, ...Reflect.ownKeys(toAdd)].map(item => item.toLowerCase()));

	// first remove headers to remove and rewritable headers (to avoid the same headers with different cases)
	for (const key of Reflect.ownKeys(finallyHeaders)) {
		if (toRemoveSet.has(key.toLowerCase())) {
			delete finallyHeaders[key];
		}
	}

	// then add new headers
	Object.assign(finallyHeaders, toAdd);

	return finallyHeaders;
}
