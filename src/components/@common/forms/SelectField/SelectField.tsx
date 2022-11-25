import React, {memo} from 'react';
import cn from 'classnames';
import styles from './selectField.css';

const defaultOptionTitleGetter = (value: string) => value;

type NativeSelectField = React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
interface SelectFieldProps extends NativeSelectField {
	options: string[];
	optionTitleGetter?(value: string): string;
}

export const SelectField = memo<SelectFieldProps>((props) => {
	const {className, options, value, optionTitleGetter = defaultOptionTitleGetter, ...nativeProps} = props;

	return (
		<div className={cn(styles.root, className)}>
			<select className={styles.field} value={value} {...nativeProps}>
				{options.map((option) => (
					<option key={option} className={styles.option} value={option}>
						{optionTitleGetter(option)}
					</option>
				))}
			</select>
		</div>
	);
});

SelectField.displayName = 'SelectField';
