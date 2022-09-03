import {useCallback, useEffect, useMemo, useState} from 'react';

export function useMediaQuery<TV, TD>(conditions: Record<string, TV>, defaultValue: TD): TV | TD {
	const conditionsMap = useMemo(
		() =>
			new Map<MediaQueryList, TV>(Object.entries(conditions).map(([query, value]) => [matchMedia(query), value])),
		[],
	);

	const mediaQueryLists = useMemo(() => Array.from(conditionsMap.keys()), [conditionsMap]);

	// Function that gets value based on matching media query
	const getValue = useCallback(() => {
		const activeMql = mediaQueryLists.find((mql) => mql.matches);
		return activeMql ? conditionsMap.get(activeMql)! : defaultValue;
	}, [conditionsMap, mediaQueryLists]);

	// State of the current matched option
	const [value, setValue] = useState(getValue);

	useEffect(() => {
		const handler = () => setValue(getValue);

		for (const mql of mediaQueryLists) {
			mql.addListener(handler);
		}

		return () => {
			for (const mql of mediaQueryLists) {
				mql.removeListener(handler);
			}
		};
	}, []);

	return value;
}

export function useBooleanMediaQuery(query: string) {
	return useMediaQuery({[query]: true}, false);
}
