import React, {memo} from 'react';
import {requestMethodsList} from '@/constants/RequestMethod';
import {SelectField} from '@/components/@common/forms/SelectField';
import {FieldRow} from '../FieldRow';

interface RequestMethodFieldProps {
	name: string;
}

export const RequestMethodField = memo<RequestMethodFieldProps>(function RequestMethodField({name}) {
	return (
		<FieldRow title='Method:'>
			<SelectField name={name} placeholder='Method' options={requestMethodsList} />
		</FieldRow>
	);
});
