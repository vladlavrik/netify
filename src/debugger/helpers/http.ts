import {StatusCode} from '@/debugger/constants/StatusCode';
import {RequestBodyType} from '@/debugger/constants/RequestBodyType';
import {RequestHeaders} from '@/debugger/interfaces/chromeInternal';

//TODO test with HTTP2
export function compileRawBaseResponse(
	statusCode: number,
	headers: RequestHeaders,
	bodyType: RequestBodyType,
	bodyValue: Blob | string | null
): Promise<string> {
	const statusLine = `HTTP/1.1 ${statusCode} ${StatusCode[statusCode]}`;
	const headersPart = Object.entries(headers)
		.map(([key, value]) =>  key + ': ' + value)
		.join('\n');

	let bodyPartBlob;
	switch (bodyType) {
		case null:
			break;

		case RequestBodyType.Text:
			bodyPartBlob = new Blob([bodyValue || '']);
			break;

		case RequestBodyType.Base64:
			bodyPartBlob = new Blob([atob(bodyValue as string || '')]);
			break;

		case RequestBodyType.Blob:
			bodyPartBlob = bodyValue;
			break;
	}

	const resultBlob = new Blob([
		statusLine + '\n' + headersPart + '\n\n',
		bodyPartBlob as Blob | string
	], {type: 'text/plain'});


	const reader = new FileReader();
	reader.readAsDataURL(resultBlob);

	return new Promise((resolve, reject) => {
		reader.onerror = () => {
			reject(reader.error);
		};

		reader.onloadend = () => {
			const resultString = reader.result! as string; // result format: "data:<type>;<subtype>,<content>"
			const contentStart = resultString.indexOf(',');
			const content = resultString.substr(contentStart + 1);
			resolve(content);
		};
	});
}


export async function bodyToString(type: RequestBodyType, value: Blob | string): Promise<string> {
	switch (type) {
		case RequestBodyType.Text:
			return value as string;

		case RequestBodyType.Base64:
			return atob(value as string);

		case RequestBodyType.Blob: {
			const reader = new FileReader();

			reader.readAsText(value as Blob);

			return await new Promise((resolve, reject) => {
				reader.onerror = () => {
					reject(reader.error);
				};

				reader.onloadend = () => {
					resolve(reader.result! as string);
				};
			});
		}
	}

}

export function mutateHeaders(originalHeaders: RequestHeaders, toAdd: RequestHeaders, toRemove: string[]) {
	const finallyHeaders = {...originalHeaders};

	const toRemoveSet = new Set([...toRemove, ...Reflect.ownKeys(toAdd)].map((item => (item as string).toLowerCase())));

	// first clean headers to remove it and rewritable (remove addable to avoid the same headers with different cases)
	for (const key of Reflect.ownKeys(finallyHeaders) as string[]) {
		if (toRemoveSet.has(key.toLowerCase())) {
			delete finallyHeaders[key];
		}
	}

	// then add new headers
	Object.assign(finallyHeaders, toAdd);

	return finallyHeaders;
}
