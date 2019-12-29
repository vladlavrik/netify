import React, {memo, useMemo, useRef} from 'react';
import {useField} from 'formik';
import classNames from 'classnames';
import {useDropdownAutoPosition} from '@/hooks/useDropdownAutoPosition';
import {useSelectExpansion} from './useSelectExpansion';
import {useSelectChange} from './useSelectChange';
import {useSelectKeyboard} from './useSelectKeyboard';
import styles from './selectField.css';

interface SelectFieldProps {
	className?: string;
	name: string;
	options: string[];
	placeholder?: string;
	multiple?: boolean;
	required?: boolean; // Disallow to select no one option (TODO use it)
}

export const SelectField = memo((props: SelectFieldProps) => {
	const {className, name, options, placeholder, multiple} = props;

	const targetRef = useRef<HTMLButtonElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	const [field] = useField<string | string[] | undefined>(name);

	const values = useMemo<string[]>(() => {
		if (!multiple) {
			return field.value === undefined ? [] : [field.value as string]; // Empty array values if passed value is nullable
		}
		return field.value as string[];
	}, [multiple, field.value]);

	const hasValue = values.length > 0;

	const {
		expanded,
		handleExpansionToggle,
		handleExpand,
		handleCollapse,
		handleFocusOut,
		handleRefocusOnBlurRequire,
	} = useSelectExpansion(targetRef);

	const {handleOptionSelect, handleOptionClick} = useSelectChange({
		name,
		values,
		options,
		multiple,
		handleCollapse,
	});

	const [[, expandTo], [, contentMaxHeight]] = useDropdownAutoPosition({
		targetRef,
		contentRef,
		checkByY: true,
		expanded,
	});

	const {focusedOptionIndex, handleKeyboardEvent} = useSelectKeyboard({
		options,
		multiple,
		expanded,
		handleExpand,
		handleCollapse,
		handleOptionSelect,
	});

	return (
		<div className={classNames(styles.root, className)}>
			<button
				ref={targetRef}
				className={classNames(styles.label, !hasValue && styles.empty)}
				type='button'
				onClick={handleExpansionToggle}
				onBlur={handleFocusOut}
				onKeyDown={handleKeyboardEvent}>
				{values.join(', ') || placeholder}
			</button>

			{expanded && (
				<div
					ref={contentRef}
					className={classNames(styles.content, styles[`expand-to-${expandTo}`])}
					style={{maxHeight: contentMaxHeight}}>
					<ul>
						{options.map((option, index) => (
							<li
								key={option}
								className={classNames({
									[styles.option]: true,
									[styles.selected]: values.includes(option),
									[styles.highlighted]: index === focusedOptionIndex,
								})}
								data-index={index}
								onClick={handleOptionClick}
								onPointerDown={handleRefocusOnBlurRequire}>
								{option}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
});

SelectField.displayName = 'SelectField';
