import React, {FC} from 'react';
import {ErrorMessage} from 'formik';
import styles from './fieldError.css';

interface FieldErrorProps {
	name: string;
}

export const FieldError: FC<FieldErrorProps> = ({name}) => {
	return <ErrorMessage component='p' className={styles.root} name={name} />;
};

FieldError.displayName = 'FieldError';
