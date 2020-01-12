import React, {memo} from 'react';
import cn from 'classnames';
import {useField} from 'formik';
import styles from './textareaField.css';

interface TextareaFieldProps {
	className?: string;
	name: string;
	placeholder?: string;
	rows?: number;
	maxlength?: number;
	disabled?: boolean;
}

export const TextareaField = memo<TextareaFieldProps>(function TextareaField(props) {
	const {className, name, placeholder, rows = 4, maxlength, disabled} = props;
	const [{value, onChange, onBlur}] = useField<string>(name);

	return (
		<textarea
			className={cn(styles.root, className)}
			name={name}
			disabled={disabled}
			placeholder={placeholder}
			maxLength={maxlength}
			rows={rows}
			spellCheck={false}
			value={value}
			onChange={onChange}
			onBlur={onBlur}
		/>
	);
});
