import React, {FC, ReactNode} from 'react';
import cn from 'classnames';
import {WithTooltip} from '../../misc/WithTooltip';
import styles from './iconButton.css';

type NativeButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export interface IconButtonProps extends Omit<NativeButtonProps, 'ref'> {
	icon: ReactNode;
	tooltip?: string;
	outline?: boolean;
}

export const IconButton: FC<IconButtonProps> = (props) => {
	const {className, icon, tooltip, disabled, outline, children, ...nativeProps} = props;

	return (
		<WithTooltip disabled={disabled} tooltip={tooltip}>
			<button
				className={cn(styles.root, outline && styles.isOutline, className)}
				type='button'
				disabled={disabled}
				{...nativeProps}>
				<div className={styles.icon}>{icon}</div>
				{children && <div className={styles.title}>{children}</div>}
			</button>
		</WithTooltip>
	);
};

IconButton.displayName = 'IconButton';
