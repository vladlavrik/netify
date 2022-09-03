import React, {memo, useRef} from 'react';
import {IconButton, IconButtonProps} from '../IconButton';
import styles from './iconFileButton.css';

interface IconFileButtonProps extends IconButtonProps {
	accept?: string;
	multiple?: boolean;
	onFileSelect(files: FileList): void;
}

export const IconFileButton = memo<IconFileButtonProps>(function IconFileButton(props) {
	const {accept, multiple, onFileSelect, ...proxyProps} = props;

	const fieldRef = useRef<HTMLInputElement>(null);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.currentTarget.files;
		if (files) {
			onFileSelect(files);
			fieldRef.current!.value = '';
		}
	};

	const handleSelectTrigger = () => {
		fieldRef.current!.click();
	};

	return (
		<>
			<input
				ref={fieldRef}
				className={styles.field}
				type='file'
				tabIndex={-1}
				disabled={proxyProps.disabled}
				multiple={multiple}
				accept={accept}
				onChange={handleChange}
			/>
			<IconButton onClick={handleSelectTrigger} {...proxyProps} />
		</>
	);
});
