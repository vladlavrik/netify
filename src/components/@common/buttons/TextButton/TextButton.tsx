import React, {memo} from 'react';
import cn from 'classnames';
import styles from './textButton.css';

type NativeButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
type TextButtonProps = Omit<NativeButtonProps, 'type'>;

export const TextButton = memo<TextButtonProps>(function TextButton(props) {
	const {className, children, ...nativeProps} = props;

	return (
		<button {...nativeProps} className={cn(styles.root, className)} type='button'>
			{children}
		</button>
	);
});
