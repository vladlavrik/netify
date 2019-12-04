import * as React from 'react';
import classNames from 'classnames';
import {useField, useFormikContext} from 'formik';
import styles from './fileField.css';

interface Props {
	className?: string;
	name: string;
}

export const FileField = React.memo(({className, name}: Props) => {
	const [{value, onBlur}] = useField<File>(name);
	const {setFieldValue} = useFormikContext<any>();

	const onChange = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files![0];
			if (file) {
				setFieldValue(name, file);
			}
		},
		[setFieldValue],
	);

	return (
		<label className={classNames(styles.root, className)}>
			<input className={styles.input} name={name} type='file' onChange={onChange} onBlur={onBlur} />
			{value ? (
				<React.Fragment>
					<p className={styles.value}>{value.name}</p>
					<p className={styles.note}>Body replacing will also rewrites "Content-Type" header</p>
				</React.Fragment>
			) : (
				<p className={styles.title}>Click to choice file or drag-n-drop it here</p>
			)}
		</label>
	);
});
