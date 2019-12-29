import React, {memo} from 'react';
import {ErrorMessage} from 'formik';
import styles from './fieldError.css';

interface FieldErrorProps {
	name: string;
}

export const FieldError = memo<FieldErrorProps>(({name}) => (
	<ErrorMessage component='p' className={styles.root} name={name} />
));

FieldError.displayName = 'FieldError';
