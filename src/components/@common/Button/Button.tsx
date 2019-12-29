import React, {memo} from 'react';
import classNames from 'classnames';
import styles from './button.css';

type NativeButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
interface ButtonProps extends NativeButtonProps {
	styleType?: 'unfilled' | 'light' | 'dark';
	withIcon?: boolean;
}

export const Button = memo<ButtonProps>(props => {
	const {className, type = 'button', styleType = 'unfilled', withIcon, children, ...nativeProps} = props;

	return (
		<button
			{...nativeProps}
			className={classNames(styles.root, styles['style-' + styleType], withIcon && styles.withIcon, className)}
			type={type as any /*TS workaround*/}>
			{children}
		</button>
	);
});

Button.displayName = 'Button';
