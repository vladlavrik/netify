const urlPatterRegexp = {
	protocol: /\[protocol\]/gi,
	host: /\[host\]/gi,
	hostname: /\[hostname\]/gi,
	port: /\[port\]/gi,
	path: /\[path\]/gi,
	query: /\[query\]/gi,
};

export function compileUrlFromPattern(replacePattern: string, originalUrl: string) {
	const originalUrlParts = new URL(originalUrl);

	return replacePattern
		.replace(urlPatterRegexp.protocol, originalUrlParts.protocol)
		.replace(urlPatterRegexp.host, originalUrlParts.host)
		.replace(urlPatterRegexp.hostname, originalUrlParts.hostname)
		.replace(urlPatterRegexp.port, originalUrlParts.port)
		.replace(urlPatterRegexp.path, originalUrlParts.pathname)
		.replace(urlPatterRegexp.query, originalUrlParts.search);
}
