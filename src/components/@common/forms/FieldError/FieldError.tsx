import * as React from 'react';
import {ErrorMessage} from 'formik';
import styles from './fieldError.css';

interface Props {
	name: string;
}

export const FieldError = React.memo(({name}: Props) => (
	<ErrorMessage component='p' className={styles.root} name={name} />
));
