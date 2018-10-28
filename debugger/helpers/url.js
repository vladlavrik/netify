const urlPartsRegexp = /^(https:|http:)?(\/\/)((.+?)(:(\d+))?)(\/(.+?))?(\?(.+?))?(#.+)?$/i;


/**
 *
 * @param {Object[]} replacePattern
 * @param {'text'|'proxyPart'|'proxyValue'} replacePattern[].type
 * @param {string} replacePattern[].value
 * @param {string} originalUrl
 */
export function compileUrlFromPattern(replacePattern, originalUrl) {
	const originalUrlParts = parseUrlParts(originalUrl);

	return replacePattern
		.map(item => {
			switch (item.type) {
				case 'text':
					return item.value;

				case 'proxyPart':
					return originalUrlParts[item.value];

				case 'proxyValue':
					// TODO implement "proxyValue" type: value from regex exec group
					return item.value;
			}
		})
		.join('');
}


/**
 *
 * @param {string} url
 */
function parseUrlParts(url) {
	const [, protocol, , hostname, host, , port, path = '', , , query = ''] = urlPartsRegexp.exec(url);
	return {protocol, host, hostname, port, path, query};
}
