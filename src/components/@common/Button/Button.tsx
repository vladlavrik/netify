import * as React from 'react';
import classNames from 'classnames';
import styles from './button.css';

interface Props {
	className?: string;
	type?: string;
	styleType?: 'unfilled' | 'light' | 'dark';
	withIcon?: boolean;
	disabled?: boolean;
	onClick?(event: React.MouseEvent<HTMLButtonElement>): void;
	children: React.ReactNode;
}

export const Button = React.memo((props: Props) => {
	const {className, type = 'button', styleType = 'unfilled', withIcon, disabled, onClick, children} = props;

	return (
		<button
			className={classNames(styles.root, styles['style-' + styleType], withIcon && styles.withIcon, className)}
			type={type as any /*TS workaround*/}
			disabled={disabled}
			onClick={onClick}>
			{children}
		</button>
	);
});
