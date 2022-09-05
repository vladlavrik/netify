import Protocol from 'devtools-protocol';

type HeaderEntry = Protocol.Fetch.HeaderEntry;

export function headersMapToArray(headersMap: Record<string, string>): HeaderEntry[] {
	return Object.entries(headersMap).map(([name, value]) => ({name, value}));
}

export function patchHeaders(initial: HeaderEntry[], toAdd: HeaderEntry[], toRemove: string[]) {
	const skipSet = new Set([
		...toAdd.map(({name}) => name.toLowerCase()),
		...toRemove.map((name) => name.toLowerCase()),
	]);

	return initial.filter(({name}) => !skipSet.has(name.toLowerCase())).concat(toAdd);
}
