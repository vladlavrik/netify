import * as React from 'react';
import classNames from 'classnames';
import styles from './IconButton.css';

interface Props {
	className?: string;
	tooltip?: string;
	disabled?: boolean;
	onClick?: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export class IconButton extends React.Component<Props> {
	render() {
		return (
			<button
				className={classNames(this.props.className, styles.root)}
				disabled={this.props.disabled}
				onClick={this.props.onClick}>
				<p className={styles.tooltip}>{this.props.tooltip}</p>
			</button>
		);
	}
}
