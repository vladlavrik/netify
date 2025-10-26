import React, {forwardRef, ReactNode} from 'react';
import cn from 'classnames';
import styles from './textButton.css';

const styleTypeOptions = {
	regular: styles.styleRegular,
	outlined: styles.styleOutlined,
	secondary: styles.styleSecondary,
	raised: styles.styleRaised,
};

const iconStyleTypeOptions = {
	regular: styles.iconStyleRegular,
	dangerous: styles.iconStyleDangerous,
	accept: styles.iconStyleAccept,
};

type NativeButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export interface TextButtonProps extends Omit<NativeButtonProps, 'ref'> {
	icon?: ReactNode;
	styleType?: keyof typeof styleTypeOptions;
	iconStyleType?: keyof typeof iconStyleTypeOptions;
	outline?: boolean;
}

export const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>((props, ref) => {
	const {
		className,
		icon,
		outline,
		styleType = 'regular',
		iconStyleType = 'regular',
		children,
		...nativeProps
	} = props;

	return (
		<button
			ref={ref}
			className={cn(styles.root, styleTypeOptions[styleType], outline && styles.isOutline, className)}
			type='button'
			{...nativeProps}>
			{icon && <div className={cn(styles.icon, iconStyleTypeOptions[iconStyleType])}>{icon}</div>}
			<div className={styles.title}>{children}</div>
		</button>
	);
});

TextButton.displayName = 'TextButton';
