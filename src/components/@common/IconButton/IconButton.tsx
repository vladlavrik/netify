import * as React from 'react';
import classNames from 'classnames';
import styles from './iconButton.css';
import {WithTooltip} from '@/components/@common/WithTooltip';

interface Props {
	className?: string;
	tooltip?: string;
	disabled?: boolean;
	onClick?: (event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
}

export class IconButton extends React.Component<Props> {
	render() {
		const {className, tooltip, disabled, onClick} = this.props;
		return (
			<WithTooltip disabled={disabled} tooltip={tooltip}>
				<button
					className={classNames(className, styles.root)}
					type='button'
					disabled={disabled}
					onClick={onClick}
				/>
			</WithTooltip>
		);
	}
}
