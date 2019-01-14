import * as React from 'react';
import classNames from 'classnames';
import styles from './button.css';

interface Props {
	className?: string;
	type?: string;
	styleType?: 'main' | 'secondary';
	disabled?: boolean;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => any;
}

export class Button extends React.Component<Props> {
	render() {
		const {className, type = 'button', styleType = 'main', disabled, onClick, children} = this.props;

		return (
			<button
				className={classNames(styles.root, styles['style-' + styleType], className)}
				type={type}
				disabled={disabled}
				onClick={onClick}>
				{children}
			</button>
		);
	}
}
