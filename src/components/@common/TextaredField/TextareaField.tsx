import * as React from 'react';
import classNames from 'classnames';
import {Field} from 'formik';
import styles from './textareaField.css';

interface Props {
	className?: string;
	name: string;
	placeholder?: string;
	rows?: number;
	maxlength?: number;
	disabled?: boolean;
}

interface FieldRenderProps {
	field: {
		onChange(e: React.ChangeEvent<any>): void;
		onBlur(e: any): void;
		value: any;
	};
}

export class TextareaField extends React.PureComponent<Props> {
	render() {
		const {className, name, placeholder, rows = 4, maxlength, disabled} = this.props;

		return (
			<Field
				name={name}
				render={({field}: FieldRenderProps) => (
					<textarea
						className={classNames(styles.root, className)}
						name={name}
						disabled={disabled}
						placeholder={placeholder}
						maxLength={maxlength}
						rows={rows}
						spellCheck={false}
						onChange={field.onChange}
						onBlur={field.onBlur}
						value={field.value}
					/>
				)}
			/>
		);
	}
}
