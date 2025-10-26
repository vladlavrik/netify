import React, {forwardRef, ReactNode} from 'react';
import cn from 'classnames';
import {WithTooltip} from '../../misc/WithTooltip';
import styles from './iconButton.css';

const styleTypeOptions = {
	regular: styles.styleRegular,
	dangerous: styles.styleDangerous,
};

type NativeButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export interface IconButtonProps extends Omit<NativeButtonProps, 'ref'> {
	icon: ReactNode;
	styleType?: keyof typeof styleTypeOptions;
	active?: boolean;
	tooltip?: ReactNode;
	tooltipDisabled?: boolean;
	tooltipStyled?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
	const {
		className,
		icon,
		styleType = 'regular',
		tooltip,
		active,
		disabled,
		tooltipStyled,
		tooltipDisabled,
		children,
		...nativeProps
	} = props;

	return (
		<WithTooltip
			className={cn(styles.root, active && styles.isActive, styleTypeOptions[styleType], className)}
			disabled={disabled || tooltipDisabled}
			tooltip={tooltip}
			tooltipStyled={tooltipStyled}
			render={(tooltipTargetProps) => (
				<button {...tooltipTargetProps} ref={ref} type='button' disabled={disabled} {...nativeProps}>
					<div className={styles.icon}>{icon}</div>
					{children && <div className={styles.title}>{children}</div>} {/* TODO remove this */}
				</button>
			)}
		/>
	);
});

IconButton.displayName = 'IconButton';
