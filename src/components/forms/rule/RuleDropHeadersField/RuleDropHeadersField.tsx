import React, {memo} from 'react';
import {TextArrayField} from '@/components/@common/forms/TextArrayField';

interface RuleDropHeadersFieldProps {
	name: string;
}

export const RuleDropHeadersField = memo<RuleDropHeadersFieldProps>(({name}) => {
	return <TextArrayField name={name} placeholder='Header name' />;
});

RuleDropHeadersField.displayName = 'RuleDropHeadersField';
