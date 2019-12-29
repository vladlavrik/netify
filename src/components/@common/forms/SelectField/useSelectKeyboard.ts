import React, {useState, useCallback, useEffect} from 'react';

interface UseSelectFieldKeyboardParams {
	options: string[];
	multiple?: boolean;
	expanded: boolean;
	handleExpand(): void;
	handleCollapse(): void;
	handleOptionSelect(option: string, allowMultiple: boolean): void;
}

export function useSelectKeyboard(params: UseSelectFieldKeyboardParams) {
	const {options, multiple, expanded, handleExpand, handleCollapse, handleOptionSelect} = params;

	const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1);

	const handleFocusMove = useCallback(
		(delta: 1 | -1) => {
			const maxIndex = options.length - 1;
			let newIndex = focusedOptionIndex + delta;

			if (newIndex < 0) {
				newIndex = maxIndex;
			} else if (newIndex > maxIndex) {
				newIndex = 0;
			}

			setFocusedOptionIndex(newIndex);
		},
		[options.length, focusedOptionIndex],
	);

	const handleKeyboardEvent = useCallback(
		(event: React.KeyboardEvent<HTMLButtonElement>) => {
			const {code} = event.nativeEvent;

			switch (code) {
				case 'Escape':
					// Collapse only
					event.preventDefault();
					handleCollapse();
					break;

				case 'Enter':
				case 'Space': {
					// Select in single or  multi mode a focused option if dd is expanded or expand otherwise
					event.preventDefault();
					if (!expanded) {
						handleExpand();
						break;
					}

					if (focusedOptionIndex === -1) {
						handleCollapse();
						break;
					}

					const allowMultiple = code === 'Space';
					handleOptionSelect(options[focusedOptionIndex], allowMultiple);
					if (!multiple || !allowMultiple) {
						handleCollapse();
					}
					break;
				}

				case 'ArrowUp':
					event.preventDefault();
					if (expanded) {
						handleFocusMove(-1);
					} else {
						handleExpand();
					}
					break;

				case 'ArrowDown':
					event.preventDefault();
					if (expanded) {
						handleFocusMove(+1);
					} else {
						handleExpand();
					}
					break;
			}
		},
		[expanded, options, focusedOptionIndex, handleFocusMove, handleExpand, handleCollapse, handleOptionSelect],
	);

	useEffect(
		() => () => {
			setFocusedOptionIndex(-1);
		},
		[expanded],
	);

	return {
		focusedOptionIndex,
		handleKeyboardEvent,
	};
}
