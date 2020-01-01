import React, {memo, useMemo} from 'react';
import {ResponseBodyType, responseBodyTypesList} from '@/constants/ResponseBodyType';
import {RadioTabs} from '@/components/@common/forms/RadioTabs';
import {TextareaField} from '@/components/@common/forms/TextaredField';
import {FileField} from '@/components/@common/forms/FileField';
import {FieldRow} from '../FieldRow';

function typeTitleGetter(type: 'Original' | ResponseBodyType) {
	switch (type) {
		case 'Original':
			return 'Original';
		case ResponseBodyType.Text:
			return 'Text';
		case ResponseBodyType.Base64:
			return 'Base 64';
		case ResponseBodyType.File:
			return 'File';
	}
}

interface ResponseBodyFieldProps {
	name: string;
	allowOrigin?: boolean;
}

export const ResponseBodyField = memo<ResponseBodyFieldProps>(({name, allowOrigin}) => {
	const options = useMemo(() => {
		return allowOrigin ? ['Original', ...responseBodyTypesList] : responseBodyTypesList;
	}, [allowOrigin]);

	return (
		<FieldRow title='Body:'>
			<RadioTabs name={`${name}.type`} options={options} optionTitleGetter={typeTitleGetter}>
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
