import * as React from 'react';
import classNames from 'classnames';
import styles from './expandableCheckbox.css';
import {Field} from 'formik';

interface Props {
	className?: string;
	name: string;
	label?: string;
	disabled?: boolean;
}

interface FieldRenderProps {
	field: {
		onChange: (e: React.ChangeEvent<any>) => void;
		onBlur: (e: any) => void;
		value: boolean;
	};
}

export class ExpandableCheckbox extends React.PureComponent<Props> {
	render() {
		const {className, name, label, disabled, children} = this.props;

		return (
			<Field
				name={name}
				render={({field}: FieldRenderProps) => (
					<div className={classNames(styles.root, className)}>
						<label className={styles.labelWrapper}>
							<input
								className={styles.input}
								name={name}
								type='checkbox'
								checked={field.value}
								disabled={disabled}
								onChange={field.onChange}
								onBlur={field.onBlur}
							/>
							<p className={styles.label}>{label}</p>
						</label>

						{field.value && <div className={styles.content}>{children}</div>}
					</div>
				)}
			/>
		);
	}
}
