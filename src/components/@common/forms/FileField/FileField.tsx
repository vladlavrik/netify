import React, {memo, useCallback} from 'react';
import {useField} from 'formik';
import classNames from 'classnames';
import styles from './fileField.css';

interface FileFieldProps {
	className?: string;
	name: string;
}

export const FileField = memo<FileFieldProps>(({className, name}) => {
	const [{value, onBlur}, , {setValue}] = useField<File>(name);

	const onChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files![0];
			if (file) {
				setValue(file);
			}
		},
		[setValue],
	);

	return (
		<label className={classNames(styles.root, className)}>
			<input className={styles.input} name={name} type='file' onChange={onChange} onBlur={onBlur} />
			{value ? (
				<>
					<p className={styles.value}>{value.name}</p>
					<p className={styles.note}>Body replacing will also rewrites &quot;Content-Type&quot; header</p>
				</>
			) : (
				<p className={styles.title}>Click to choice a file or drag-n-drop it here</p>
			)}
			<div className={styles.filler} />
		</label>
	);
});

FileField.displayName = 'FileField';
