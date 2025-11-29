import React, {CSSProperties, memo, useEffect, useRef, useState} from 'react';
import cn from 'classnames';
import {useField} from 'formik';
import {WithTooltip} from '@/components/@common/misc/WithTooltip';
import {useMultiselectKeyboard} from './useMultiselectKeyboard';
import CheckmarkIcon from '@/assets/icons/checkmark.svg';
import InfoIcon from '@/assets/icons/info.svg';
import styles from './multiselectField.css';

interface MultiselectFieldProps {
	className?: string;
	name: string;
	options: string[];
	optionTitleGetter?(value: string): string;
	placeholder?: string;
	required?: boolean; // Disallow to select no one option
}

export const MultiselectField = memo<MultiselectFieldProps>((props) => {
	const {className, name, placeholder, required} = props;
	const {optionTitleGetter = (key: string) => key} = props;

	const targetRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const fieldsetRef = useRef<HTMLFieldSetElement>(null);

	const [field, , {setValue}] = useField<string[]>(name);

	const values = field.value;
	const hasValue = values.length > 0;

	const options = !required ? [undefined, ...props.options] : props.options;

	// Listen popover extend
	const [expanded, setExpanded] = useState(false);
	useEffect(() => {
		const popoverNode = popoverRef.current!;
		const handler = (event: ToggleEvent) => {
			setExpanded(event.newState === 'open');
		};
		popoverNode.addEventListener('beforetoggle', handler);

		return () => {
			popoverNode.removeEventListener('beforetoggle', handler);
		};
	}, []);

	// Bind popover target to popover content
	useEffect(() => {
		targetRef.current!.popoverTargetElement = popoverRef.current;
	}, []);

	const switchValue = (optionValue: string, willChecked: boolean) => {
		if (willChecked) {
			setValue([...values, optionValue]);
		} else {
			setValue(values.filter((item) => item !== optionValue));
		}
	};

	const handleCheckboxClick = (event: React.MouseEvent<HTMLInputElement>) => {
		const checkboxNode = event.currentTarget;
		const optionIndex = Number(checkboxNode.dataset.index);
		const optionValue = options[optionIndex];

		// Select singe value
		if (!event.shiftKey || optionValue === undefined) {
			setValue(optionValue === undefined ? [] : [optionValue]);
			popoverRef.current!.hidePopover();
		}
		// Switch a multiselect value
		else {
			switchValue(optionValue, checkboxNode.checked);
		}
	};

	const handleFocusHoveredOption = (event: React.MouseEvent<HTMLElement>) => {
		const targetNode = event.currentTarget.querySelector('input');
		targetNode?.focus();
	};

	const {handleKeydown} = useMultiselectKeyboard({
		options,
		values,
		popoverRef,
		fieldsetRef,
		setValue,
		switchValue,
	});

	const anchorName = `--multiselect-${name.replace(/[._:]/g, '-')}`;

	return (
		<div className={cn(styles.root, className)}>
			<button
				ref={targetRef}
				className={cn(styles.label, !hasValue && styles.empty, expanded && styles.isExpanded)}
				style={{anchorName} as CSSProperties}
				type='button'
				title={values.length > 1 ? values.join(', ') : undefined}
				onKeyDown={handleKeydown}>
				{values.length === 0 ? placeholder : values.map(optionTitleGetter).join(', ')}
			</button>

			<div
				ref={popoverRef}
				className={styles.content}
				style={{positionAnchor: anchorName} as CSSProperties}
				{...{popover: 'auto'}}>
				<div className={styles.contentBody}>
					<fieldset ref={fieldsetRef} className={styles.fieldset} onKeyDown={handleKeydown}>
						{options.map((option, index) => {
							const isEmpty = option === undefined;
							return (
								<label
									key={option || 'empty'}
									className={cn(styles.option, isEmpty && styles.empty)}
									onMouseEnter={handleFocusHoveredOption}>
									<input
										className={styles.optionCheckbox}
										type='checkbox'
										name={`${name}-checkbox-${option || '@@empty'}`}
										data-index={index}
										checked={!!option && values.includes(option)}
										readOnly
										onClick={handleCheckboxClick}
									/>

									<span className={styles.optionLabel}>
										<span className={styles.optionTitle}>
											{isEmpty ? placeholder || 'None' : optionTitleGetter(option!)}
										</span>
										<CheckmarkIcon className={styles.optionCheckmark} />
									</span>
								</label>
							);
						})}
					</fieldset>
				</div>
				<div className={styles.hintFooter}>
					<WithTooltip
						className={styles.hintTarget}
						tagName='p'
						tooltip={
							<>
								Use Shift+mouse click to multiple selection.
								<br />
								Or focus with keyboard and Space key
							</>
						}>
						<InfoIcon />
						Multiselect allowed
					</WithTooltip>
				</div>
			</div>
		</div>
	);
});

MultiselectField.displayName = 'MultiselectField';
