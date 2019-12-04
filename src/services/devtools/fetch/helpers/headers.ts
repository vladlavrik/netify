import {HeadersArray, HeadersMap} from '@/interfaces/headers';

export function headersMapToArray(headersMap: HeadersMap): HeadersArray {
	return Object.entries(headersMap).map(([name, value]) => ({name, value}));
}

export function patchHeaders(initial: HeadersArray, toAdd: HeadersArray, toRemove: string[]) {
	const skipSet = new Set([
		...toAdd.map(({name}) => name.toLowerCase()),
		...toRemove.map(name => name.toLowerCase()),
	]);

	return initial.filter(({name}) => !skipSet.has(name.toLowerCase())).concat(toAdd);
}
