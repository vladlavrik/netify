import React, {memo} from 'react';
import classNames from 'classnames';
import {WithTooltip} from '../../misc/WithTooltip';
import styles from './iconButton.css';

type NativeButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
interface IconButtonProps extends Omit<NativeButtonProps, 'type'> {
	tooltip?: string;
}

export const IconButton = memo<IconButtonProps>(props => {
	const {className, tooltip, disabled, children, ...nativeProps} = props;

	return (
		<WithTooltip disabled={disabled} tooltip={tooltip}>
			<button {...nativeProps} className={classNames(styles.root, className)} type='button' disabled={disabled}>
				{children && <div className={styles.title}>{children}</div>}
			</button>
		</WithTooltip>
	);
});

IconButton.displayName = 'IconButton';
