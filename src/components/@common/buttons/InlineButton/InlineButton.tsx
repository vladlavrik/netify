import React, {forwardRef} from 'react';
import cn from 'classnames';
import styles from './inlineButton.css';

type NativeButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
type InlineButtonProps = Omit<NativeButtonProps, 'type'>;

export const InlineButton = forwardRef<HTMLButtonElement, InlineButtonProps>((props, ref) => {
	const {className, children, ...nativeProps} = props;

	return (
		<button {...nativeProps} ref={ref} className={cn(styles.root, className)} type='button'>
			{children}
		</button>
	);
});

InlineButton.displayName = 'InlineButton';
