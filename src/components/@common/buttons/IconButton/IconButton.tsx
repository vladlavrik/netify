import React, {memo} from 'react';
import classNames from 'classnames';
import {WithTooltip} from '../../misc/WithTooltip';
import styles from './iconButton.css';

type NativeButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
interface IconButtonProps extends Omit<NativeButtonProps, 'type'> {
	tooltip?: string;
}

export const IconButton = memo<IconButtonProps>(props => {
	const {className, tooltip, disabled, ...nativeProps} = props;

	return (
		<WithTooltip disabled={disabled} tooltip={tooltip}>
			<button {...nativeProps} className={classNames(styles.root, className)} type='button' disabled={disabled} />
		</WithTooltip>
	);
});

IconButton.displayName = 'IconButton';
