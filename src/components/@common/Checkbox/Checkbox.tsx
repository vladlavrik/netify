import * as React from 'react';
import classNames from 'classnames';
import {useField} from 'formik';
import styles from './checkbox.css';

interface Props {
	className?: string;
	name: string;
	disabled?: boolean;
	children?: React.ReactNode;
}

export const Checkbox = React.memo(({className, name, disabled, children}: Props) => {
	const [{value, onChange, onBlur}] = useField<boolean>(name);

	return (
		<label className={classNames(styles.root, className)}>
			<input
				className={styles.input}
				name={name}
				type='checkbox'
				checked={value}
				disabled={disabled}
				onChange={onChange}
				onBlur={onBlur}
			/>
			<p className={styles.imitator}>{children}</p>
		</label>
	);
});
