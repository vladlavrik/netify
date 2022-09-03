import React, {FC, ReactNode} from 'react';
import cn from 'classnames';
import styles from './checkbox.css';

type NativeInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
interface CheckboxProps extends Omit<NativeInputProps, 'type'> {
	children?: ReactNode;
}

export const Checkbox: FC<CheckboxProps> = ({className, children, ...nativeProps}) => {
	return (
		<label className={cn(styles.root, className)}>
			<input {...nativeProps} className={styles.input} type='checkbox' />
			{children && <div className={styles.label}>{children}</div>}
		</label>
	);
};

Checkbox.displayName = 'Checkbox';
