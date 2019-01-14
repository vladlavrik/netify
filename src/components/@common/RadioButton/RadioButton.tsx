import * as React from 'react';
import classNames from 'classnames';
import {Field} from 'formik';
import styles from './radioButton.css';

interface Props {
	className?: string;
	name: string;
	value: string;
	disabled?: boolean;
}

interface FieldRenderProps {
	field: {
		onChange: (e: React.ChangeEvent<any>) => void;
		onBlur: (e: any) => void;
		value: any;
	};
}

export class RadioButton extends React.Component<Props> {
	render() {
		const {className, name, value, disabled} = this.props;
		return (
			<label className={classNames(styles.root, className)}>
				<Field
					name={name}
					render={({field}: FieldRenderProps) => (
						<React.Fragment>
							<input
								className={styles.input}
								name={name}
								type='radio'
								value={value}
								disabled={disabled}
								onChange={field.onChange}
								onBlur={field.onBlur}
								checked={value === field.value}
							/>
							<div className={styles.imitator} />
						</React.Fragment>
					)}
				/>
				<p className={styles.label}>{this.props.children}</p>
			</label>
		);
	}
}
