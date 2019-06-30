import * as React from 'react';
import classNames from 'classnames';
import {useField} from 'formik';
import styles from './textareaField.css';

interface Props {
	className?: string;
	name: string;
	placeholder?: string;
	rows?: number;
	maxlength?: number;
	disabled?: boolean;
}

export const TextareaField = React.memo((props: Props) => {
	const {className, name, placeholder, rows = 4, maxlength, disabled} = props;
	const [{value, onChange, onBlur}] = useField<string>(name);

	return (
		<textarea
			className={classNames(styles.root, className)}
			name={name}
			disabled={disabled}
			placeholder={placeholder}
			maxLength={maxlength}
			rows={rows}
			spellCheck={false}
			onChange={onChange}
			onBlur={onBlur}
			value={value}
		/>
	);
});
