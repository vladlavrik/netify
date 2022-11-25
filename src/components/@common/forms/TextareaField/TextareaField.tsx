import React, {FC} from 'react';
import cn from 'classnames';
import styles from './textareaField.css';

type TextAreaNativeProps = React.DetailedHTMLProps<
	React.TextareaHTMLAttributes<HTMLTextAreaElement>,
	HTMLTextAreaElement
>;

interface TextareaFieldProps extends TextAreaNativeProps {
	name: string;
}

export const TextareaField: FC<TextareaFieldProps> = (props) => {
	const {className, name, ...nativeProps} = props;

	return <textarea className={cn(styles.root, className)} name={name} spellCheck={false} {...nativeProps} />;
};

TextareaField.displayName = 'TextareaField';
