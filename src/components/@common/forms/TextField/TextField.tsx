import React, {forwardRef, memo, ReactNode} from 'react';
import {useField} from 'formik';
import classNames from 'classnames';
import styles from './textField.css';

interface TextFieldProps {
	className?: string;
	name: string;
	placeholder?: string;
	maxlength?: number;
	disabled?: boolean;
	readOnly?: boolean;
	prefix?: ReactNode;
	suffix?: ReactNode;
}

export const TextField = memo(
	forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
		const {className, name, placeholder, maxlength, disabled, readOnly, prefix, suffix} = props;
		const [field] = useField<string>(name);

		return (
			<div className={classNames(styles.root, className)}>
				{prefix && <div className={styles.prefix}>{prefix}</div>}
				<input
					ref={ref}
					className={styles.input}
					{...field}
					value={field.value || ''}
					type='text'
					spellCheck={false}
					autoComplete='off'
					placeholder={placeholder}
					maxLength={maxlength}
					disabled={disabled}
					readOnly={readOnly}
				/>

				<div className={styles.filler} />

				{suffix && <div className={styles.suffix}>{suffix}</div>}
			</div>
		);
	}),
);

TextField.displayName = 'TextField';
