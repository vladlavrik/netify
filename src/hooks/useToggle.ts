import {useCallback, useState} from 'react';

export function useToggle(defaultValue = false) {
	const [state, setState] = useState(defaultValue);

	const handleToggle = useCallback(() => {
		setState((prevValue) => !prevValue);
	}, []);

	return [state, handleToggle, setState] as const;
}
