import React, {memo} from 'react';
import {KeyValueArrayField} from '@/components/@common/forms/KeyValueArrayField';

interface SetHeadersFieldProps {
	name: string;
}

export const SetHeadersField = memo<SetHeadersFieldProps>(({name}) => (
	<KeyValueArrayField
		name={name}
		keyNameSuffix='name'
		valueNameSuffix='value'
		keyPlaceholder='Header name'
		valuePlaceholder='Header value'
	/>
));

SetHeadersField.displayName = 'SetHeadersField';
