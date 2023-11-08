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
		keyPlaceholder={chrome.i18n.getMessage('headerName')}
		valuePlaceholder={chrome.i18n.getMessage('headerValue')}
	/>
));

SetHeadersField.displayName = 'SetHeadersField';
