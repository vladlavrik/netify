import React, {FC} from 'react';
import cn from 'classnames';
import styles from './radioButton.css';

type NativeInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export interface RadioButtonProps extends Omit<NativeInputProps, 'ref' | 'type'> {
	name: string;
	value: string | undefined;
}

export const RadioButton: FC<RadioButtonProps> = (props) => {
	const {className, children, ...nativeProps} = props;

	return (
		<label className={cn(styles.root, className)}>
			<input className={styles.input} type='radio' {...nativeProps} />
			<div className={styles.imitator} />
			<p className={styles.label}>{children}</p>
		</label>
	);
};

RadioButton.displayName = 'RadioButton';
