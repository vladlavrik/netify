import React, {useCallback} from 'react';
import {useFormikContext} from 'formik';

interface UseSelectFieldKeyboardParams {
	name: string;
	values: string[];
	options: (string | undefined)[];
	multiple?: boolean;
	handleCollapse(): void;
}

export function useSelectChange(params: UseSelectFieldKeyboardParams) {
	const {name, values, options, multiple, handleCollapse} = params;

	const {setFieldValue} = useFormikContext();

	const handleOptionSelect = useCallback(
		(newValueOption: string | undefined, allowMultiple: boolean) => {
			let newValue;

			if (newValueOption === undefined) {
				newValue = multiple ? [] : undefined;
			} else if (!multiple) {
				// Single option
				newValue = newValueOption;
			} else if (!allowMultiple) {
				// New single option when in multiple mode
				newValue = [newValueOption];
			} else {
				// Toggle the selected option im multiple mode
				newValue = options.filter(itemOption => {
					if (newValueOption === itemOption) {
						return !values.includes(itemOption);
					}
					return !!itemOption && values.includes(itemOption);
				});
			}

			// TODO wait to fix (set undefined when passed empty array) https://github.com/jaredpalmer/formik/issues/2151 and update formik
			// Temporary solution | TODO use field.onChange when it wil be fixed in formik
			setFieldValue(name, newValue, true);
		},
		[name, values, options, multiple],
	);

	const handleOptionClick = useCallback(
		(event: React.MouseEvent<HTMLLIElement>) => {
			const index = Number(event.currentTarget.dataset.index!);
			const selectedOption = options[index];

			const allowMultiple = event.metaKey || event.shiftKey;

			if (!multiple || !allowMultiple) {
				handleCollapse();
			}

			handleOptionSelect(selectedOption, allowMultiple);
		},
		[options, multiple, handleCollapse, handleOptionSelect],
	);

	return {
		handleOptionSelect,
		handleOptionClick,
	};
}
