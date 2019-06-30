import * as React from 'react';
import classNames from 'classnames';
import {Field} from 'formik';
import styles from './textField.css';

interface Props {
	className?: string;
	name: string;
	placeholder?: string;
	maxlength?: number;
	disabled?: boolean;
	prefix?: React.ReactNode;
	suffix?: React.ReactNode;
}

export const TextField = React.memo((props: Props) => {
	const {className, name, placeholder, maxlength, disabled, prefix, suffix} = props;

	return (
		<div className={classNames(styles.root, className)}>
			{prefix && <div className={styles.prefix}>{prefix}</div>}
			<Field
				className={styles.input}
				type='text'
				name={name}
				spellCheck={false}
				autoComplete='off'
				placeholder={placeholder}
				maxLength={maxlength}
				disabled={disabled}
			/>

			<div className={styles.border} />

			{suffix && <div className={styles.suffix}>{suffix}</div>}
		</div>
	);
});
