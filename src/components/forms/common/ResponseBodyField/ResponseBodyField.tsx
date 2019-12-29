import React, {memo, useMemo} from 'react';
import {ResponseBodyType, responseBodyTypesList} from '@/constants/ResponseBodyType';
import {RadioTabs} from '@/components/@common/forms/RadioTabs';
import {TextareaField} from '@/components/@common/forms/TextaredField';
import {FileField} from '@/components/@common/forms/FileField';
import {FieldRow} from '../FieldRow';

const typeOptions = responseBodyTypesList.map(type => ({
	value: type,
	title: type,
}));

const originTypeOption = {value: '', title: 'Original'};

interface ResponseBodyFieldProps {
	name: string;
	allowOrigin?: boolean;
}

export const ResponseBodyField = memo<ResponseBodyFieldProps>(({name, allowOrigin}) => {
	const options = useMemo(() => (allowOrigin ? [originTypeOption, ...typeOptions] : typeOptions), [allowOrigin]);

	return (
		<FieldRow title='Body:'>
			<RadioTabs radioName={`${name}.type`} tabs={options}>
				{tabName => {
					switch (tabName) {
						case ResponseBodyType.Text:
						case ResponseBodyType.Base64:
							return <TextareaField name={`${name}.textValue`} />;

						case ResponseBodyType.File:
							return <FileField name={`${name}.fileValue`} />;

						default:
							return null;
					}
				}}
			</RadioTabs>
		</FieldRow>
	);
});

ResponseBodyField.displayName = 'ResponseBodyField';
