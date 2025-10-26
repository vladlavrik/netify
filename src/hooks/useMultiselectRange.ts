import {useCallback, useEffect, useRef} from 'react';

/**
 * Retrieves a list of items for selection with range support (with shift button)
 */
export function useMultiselectRange<TItem, TId>(list: TItem[], idGetter: (item: TItem) => TId, hasSelected: boolean) {
	const lastSelected = useRef<TId | null>(null);

	const actualListRef = useRef(list);
	actualListRef.current = list;

	// Reset the last selected item when all in a list became unselected
	useEffect(() => {
		if (lastSelected.current && !hasSelected) {
			lastSelected.current = null;
		}
	}, [hasSelected]);

	return useCallback((id: TId, range = false) => {
		const lastSelectedId = lastSelected.current;
		lastSelected.current = id;

		// Select single item
		if (!range || !lastSelectedId) {
			return [id];
		}

		const actualList = actualListRef.current;
		const lastIndex = actualList.findIndex((item) => idGetter(item) === lastSelectedId);
		const currentIndex = actualList.findIndex((item) => idGetter(item) === id);

		// If the last selected item or the current selected item does not exist in the list,
		// handle as single selection
		if (lastIndex === -1 || currentIndex === -1) {
			return [id];
		}

		// Get selected items range
		const startIndex = Math.min(lastIndex, currentIndex);
		const endIndex = Math.max(lastIndex, currentIndex);

		return actualList.slice(startIndex, endIndex + 1).map(idGetter);
	}, []);
}

useMultiselectRange.displayName = 'useMultiselectRange';
