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
}

export class Button extends React.PureComponent<Props> {
	render() {
		const {className, type = 'button', styleType = 'unfilled', withIcon, disabled, onClick, children} = this.props;

		return (
			<button
				className={classNames(
					styles.root,
					styles['style-' + styleType],
					withIcon && styles.withIcon,
					className,
				)}
				type={type}
				disabled={disabled}
				onClick={onClick}>
				{children}
			</button>
		);
	}
}
