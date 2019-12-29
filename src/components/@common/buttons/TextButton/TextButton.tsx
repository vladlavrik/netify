import React, {memo} from 'react';
import classNames from 'classnames';
import styles from './textButton.css';

type NativeButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
type TextButtonProps = Omit<NativeButtonProps, 'type'>;

export const TextButton = memo<TextButtonProps>(props => {
	const {className, children, ...nativeProps} = props;

	return (
		<button {...nativeProps} className={classNames(styles.root, className)} type='button'>
			{children}
		</button>
	);
});

TextButton.displayName = 'TextButton';
