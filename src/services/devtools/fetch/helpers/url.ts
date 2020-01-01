const urlPartsRegexp = /^(https:|http:)?(\/\/)((.+?)(:(\d+))?)(\/(.+?))?(\?(.+?))?(#.+)?$/i;
const urlPatterRegexp = {
	protocol: /\[protocol\]/gi,
	host: /\[host\]/gi,
	hostname: /\[hostname\]/gi,
	port: /\[port\]/gi,
	path: /\[path\]/gi,
	query: /\[query\]/gi,
};

function parseUrlParts(url: string) {
	const [, protocol, , hostname, host, , port, path = '', , , query = ''] = urlPartsRegexp.exec(url)!;
	return {protocol, host, hostname, port, path, query};
}

export function compileUrlFromPattern(replacePattern: string, originalUrl: string) {
	const originalUrlParts = parseUrlParts(originalUrl);

	return replacePattern
		.replace(urlPatterRegexp.protocol, originalUrlParts.protocol)
		.replace(urlPatterRegexp.host, originalUrlParts.host)
		.replace(urlPatterRegexp.hostname, originalUrlParts.hostname)
		.replace(urlPatterRegexp.port, originalUrlParts.port)
		.replace(urlPatterRegexp.path, originalUrlParts.path)
		.replace(urlPatterRegexp.query, originalUrlParts.query);
}
