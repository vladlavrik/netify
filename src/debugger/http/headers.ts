import {HeadersMap} from '../chrome/interfaces';

export function mutateHeaders(originalHeaders: HeadersMap, toAdd: HeadersMap, toRemove: string[]) {
	const finallyHeaders = {...originalHeaders};

	const toRemoveSet = new Set([...toRemove, ...Reflect.ownKeys(toAdd)].map(item => (item as string).toLowerCase()));

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

export function replaceHeader(headers: HeadersMap, name: string, newValue: string) {
	const lowerCaseName = name.toLowerCase();
	const keyName = (Reflect.ownKeys(headers) as string[]).find(name => name.toLowerCase() === lowerCaseName);

	return {
		...headers,
		[keyName || name]: newValue,
	};
}
