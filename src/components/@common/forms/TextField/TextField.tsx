import React, {forwardRef, ReactNode} from 'react';
import cn from 'classnames';
import styles from './textField.css';

type NativeInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

interface TextFieldProps extends NativeInputProps {
	prefixChildren?: ReactNode;
	suffixChildren?: ReactNode;
}

// eslint-disable-next-line react/display-name
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
	const {className, prefixChildren, suffixChildren, ...nativeProps} = props;

	return (
		<div className={cn(styles.root, className)}>
			{prefixChildren && <div className={styles.prefix}>{prefixChildren}</div>}
			<input
				ref={ref}
				className={styles.input}
				{...nativeProps}
				type='text'
				spellCheck={false}
				autoComplete='off'
			/>

			<div className={styles.filler} />

			{suffixChildren && <div className={styles.suffix}>{suffixChildren}</div>}
		</div>
	);
});

TextField.displayName = 'TextField';
