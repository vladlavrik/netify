import {useState, useCallback} from 'react';

export function useDropdownExpansion() {
	const [expanded, setExpanded] = useState(false);

	const handleExpansionSwitch = useCallback(() => setExpanded(!expanded), [expanded]);
	const handleCollapse = useCallback(() => setExpanded(false), []);

	const actions = {handleExpansionSwitch, handleCollapse};

	return [expanded, {handleExpansionSwitch, handleCollapse}] as [boolean, typeof actions];
}
