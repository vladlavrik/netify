const urlPartsRegexp = /^(https:|http:)?(\/\/)((.+?)(:(\d+))?)(\/(.+?))?(\?(.+?))?(#.+)?$/i;
const urlPatterRegexp = {
	protocol: /%protocol%/ig,
	host: /%host%/ig,
	hostname: /%hostname%/ig,
	port: /%port%/ig,
	path: /%path%/ig,
	query: /%query%/ig,
};

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


function parseUrlParts(url: string) {
	const [, protocol, , hostname, host, , port, path = '', , , query = ''] = urlPartsRegexp.exec(url)!;
	return {protocol, host, hostname, port, path, query};
}
