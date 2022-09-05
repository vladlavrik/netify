import {RefObject, useCallback, useRef, useState} from 'react';

export function useSelectExpansion(targetRef: RefObject<HTMLElement>) {
	const [expanded, setExpanded] = useState(false);

	// Prevent collapse the content block by "blur" event after click on an option element
	const refocusOnBlueRequired = useRef(false);

	const handleExpansionToggle = useCallback(() => {
		setExpanded(!expanded);
	}, [expanded]);

	const handleExpand = useCallback(() => setExpanded(true), []);

	const handleCollapse = useCallback(() => setExpanded(false), []);

	const handleFocusOut = useCallback(() => {
		if (refocusOnBlueRequired.current) {
			refocusOnBlueRequired.current = false;
			// Workaround for https://github.com/eslint/eslint/issues/10939
			// eslint-disable-next-line no-unused-expressions
			targetRef.current?.focus();
		} else {
			setExpanded(false);
		}
	}, []);

	const handleRefocusOnBlurRequire = useCallback(() => {
		refocusOnBlueRequired.current = true;
	}, [expanded]);

	return {
		expanded,
		handleExpansionToggle,
		handleExpand,
		handleCollapse,
		handleFocusOut,
		handleRefocusOnBlurRequire,
	};
}
