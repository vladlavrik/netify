import React, {RefObject} from 'react';

interface UseSelectFieldKeyboardParams {
	options: (string | undefined)[];
	values: string[];
	popoverRef: RefObject<HTMLDivElement | null>;
	fieldsetRef: RefObject<HTMLFieldSetElement | null>;
	setValue(value: string[]): void;
	switchValue(optionValue: string, willChecked: boolean): void;
}

export function useMultiselectKeyboard(params: UseSelectFieldKeyboardParams) {
	const {options, values, popoverRef, fieldsetRef, setValue, switchValue} = params;

	const handleKeydown = (event: React.KeyboardEvent<HTMLElement>) => {
		const {code} = event.nativeEvent;

		const checkboxes = Array.from(fieldsetRef.current!.elements) as HTMLInputElement[];

		const getFocusedOptionIndex = () => {
			return document.activeElement instanceof HTMLInputElement ? checkboxes.indexOf(document.activeElement) : -1;
		};
		const checkIsPopoverShown = () => {
			return popoverRef.current?.matches(':popover-open');
		};

		switch (code) {
			case 'ArrowUp':
			case 'ArrowDown': {
				event.preventDefault();

				const firstFocusIndex = values.length === 1 ? options.indexOf(values[0]) : 0;

				// Show nto shown popover
				if (!checkIsPopoverShown()) {
					popoverRef.current!.showPopover();
					checkboxes[firstFocusIndex].focus();
					break;
				}

				// Focus next/previous option if it has a focussed one
				const focusedOptionIndex = getFocusedOptionIndex();
				const maxOptionIndex = checkboxes.length - 1;
				if (focusedOptionIndex !== -1) {
					let nextFocusIndex = focusedOptionIndex + (code === 'ArrowUp' ? -1 : 1);
					if (nextFocusIndex < 0) {
						nextFocusIndex = maxOptionIndex;
					} else if (nextFocusIndex > maxOptionIndex) {
						nextFocusIndex = 0;
					}
					checkboxes[nextFocusIndex].focus();
					break;
				}

				// Focus the first option
				checkboxes[firstFocusIndex].focus();
				break;
			}

			case 'Enter': {
				if (!checkIsPopoverShown()) {
					break;
				}

				event.preventDefault();
				const focusedOptionIndex = getFocusedOptionIndex();
				if (focusedOptionIndex === -1) {
					popoverRef.current!.hidePopover();
					break;
				}

				if (values.length <= 1) {
					const newValue = options[focusedOptionIndex];
					setValue(newValue === undefined ? [] : [newValue]);
				}
				popoverRef.current!.hidePopover();
				break;
			}

			case 'Space': {
				if (!checkIsPopoverShown()) {
					break;
				}
				event.preventDefault();
				const focusedOptionIndex = getFocusedOptionIndex();
				if (focusedOptionIndex === -1) {
					break;
				}

				const optionValue = options[focusedOptionIndex];
				if (optionValue === undefined) {
					setValue([]);
					break;
				}

				const willChecked = !checkboxes[focusedOptionIndex].checked;
				switchValue(optionValue, willChecked);
				break;
			}
		}
	};

	return {
		handleKeydown,
	};
}

useMultiselectKeyboard.displayName = 'useMultiselectKeyboard';
