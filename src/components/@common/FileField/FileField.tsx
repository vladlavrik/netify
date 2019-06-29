import * as React from 'react';
import classNames from 'classnames';
import {Field} from 'formik';
import styles from './fileField.css';

interface Props {
	className?: string;
	name: string;
}

interface FieldRenderProps {
	field: {
		onChange(e: React.ChangeEvent<any>): void;
		onBlur(e: any): void;
		value?: File;
	};
	form: {
		setFieldValue(name: string, value: File): void;
	};
}
export class FileField extends React.PureComponent<Props> {
	render() {
		const {className, name} = this.props;

		return (
			<Field
				name={name}
				render={({field, form}: FieldRenderProps) => (
					<label className={classNames(styles.root, className)}>
						<input
							className={styles.input}
							name={name}
							type='file'
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
								const file = event.target.files![0];
								if (file) {
									form.setFieldValue(name, file);
								}
							}}
							onBlur={field.onBlur}
						/>
						{field.value ? (
							<React.Fragment>
								<p className={styles.value}>{field.value.name}</p>
								<p className={styles.note}>It also will override "Content-Type" header</p>
							</React.Fragment>
						) : (
							<p className={styles.title}>Click to choice file or drag-n-drop it here</p>
						)}
					</label>
				)}
			/>
		);
	}
}
