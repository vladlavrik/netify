import React, {memo} from 'react';
import {TextArrayField} from '@/components/@common/forms/TextArrayField';
import {FieldRow} from '../FieldRow';

interface DropHeadersFieldProps {
	name: string;
}

export const DropHeadersField = memo<DropHeadersFieldProps>(function DropHeadersField({name}) {
	return (
		<FieldRow title='Drop headers:'>
			<TextArrayField name={name} placeholder='Header name' />
		</FieldRow>
	);
});
