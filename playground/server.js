const path = require('path');
const http = require('http');
const nodeStatic = require('node-static');

const port = 8000;

const staticServer = new nodeStatic.Server(path.join(__dirname, './assets'), {
	headers: {
		'X-Bar': 'foo',
		'Set-Cookie': `testcookie=value.time:${new Date().toLocaleTimeString()}; Max-Age=99999; Path=/`,
	},
});

const server = http.createServer(function (request, response) {
	console.group(`${request.method} ${request.url}`);
	for (const [name, value] of Object.entries(request.headers)) {
		console.log(`${name}: ${value}`);
	}

	const data = [];
	request.on('data', (chunk) => data.push(chunk));

	request
		.on('end', () => {
			console.log('Body:', Buffer.concat(data).toString('utf8'));
			console.log('---------\n');
			console.groupEnd();
			staticServer.serve(request, response);
		})
		.resume();
});

server.listen(port, (err) => {
	if (err) {
		console.log('Some error has occurred:', err);
		return;
	}

	console.log(`Server is listening on ${port}`);
});
