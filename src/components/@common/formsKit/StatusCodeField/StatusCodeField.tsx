import React, {memo} from 'react';
import {useField} from 'formik';
import {FieldError} from '@/components/@common/forms/FieldError';
import {TextField} from '@/components/@common/forms/TextField';
import styles from './statusCodeField.css';

interface StatusCodeFieldProps {
	name: string;
}

export const StatusCodeField = memo<StatusCodeFieldProps>(({name}) => {
	const [field] = useField(name);

	return (
		<div>
			<TextField className={styles.field} maxLength={3} {...field} />
			<FieldError name={name} />
		</div>
	);
});

StatusCodeField.displayName = 'StatusCodeField';
