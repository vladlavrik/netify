import React, {memo} from 'react';
import {TextField} from '@/components/@common/forms/TextField';
import {FieldError} from '@/components/@common/forms/FieldError';
import {FieldRow} from '../FieldRow';
import styles from './statusCodeField.css';

interface StatusCodeFieldProps {
	name: string;
}

export const StatusCodeField = memo<StatusCodeFieldProps>(({name}) => (
	<FieldRow title='Status code:'>
		<div>
			<TextField className={styles.field} name={name} maxlength={3} />
			<FieldError name={name} />
		</div>
	</FieldRow>
));

StatusCodeField.displayName = 'StatusCodeField';
