import React, {memo} from 'react';
import cn from 'classnames';
import {useField} from 'formik';
import styles from './fileField.css';

interface FileFieldProps {
	className?: string;
	name: string;
}

export const FileField = memo<FileFieldProps>(({className, name}) => {
	const [{value, onBlur}, , {setValue}] = useField<File>(name);

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files![0];
		if (file) {
			setValue(file);
		}
	};

	return (
		<label className={cn(styles.root, className)}>
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
