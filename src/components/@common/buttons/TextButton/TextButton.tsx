import React, {forwardRef} from 'react';
import cn from 'classnames';
import styles from './textButton.css';

type NativeButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
type TextButtonProps = Omit<NativeButtonProps, 'type'>;

export const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>((props, ref) => {
	const {className, children, ...nativeProps} = props;

	return (
		<button {...nativeProps} ref={ref} className={cn(styles.root, className)} type='button'>
			{children}
		</button>
	);
});

TextButton.displayName = 'TextButton';
