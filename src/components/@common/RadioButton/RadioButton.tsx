import * as React from 'react';
import classNames from 'classnames';
import {useField} from 'formik';
import styles from './radioButton.css';

interface Props {
	className?: string;
	name: string;
	value: string;
	disabled?: boolean;
	children?: React.ReactNode;
}

export const RadioButton = React.memo(({className, name, value, disabled, children}: Props) => {
	const [{value: currentValue, onChange, onBlur}] = useField<string>(name);

	return (
		<label className={classNames(styles.root, className)}>
			<input
				className={styles.input}
				name={name}
				type='radio'
				value={value}
				disabled={disabled}
				onChange={onChange}
				onBlur={onBlur}
				checked={value === currentValue}
			/>
			<div className={styles.imitator} />
			<p className={styles.label}>{children}</p>
		</label>
	);
});
