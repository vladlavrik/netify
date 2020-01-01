import React, {memo, useMemo} from 'react';
import {RequestBodyType, requestBodyTypesList} from '@/constants/RequestBodyType';
import {RadioTabs} from '@/components/@common/forms/RadioTabs';
import {TextareaField} from '@/components/@common/forms/TextaredField';
import {KeyValueArrayField} from '@/components/@common/forms/KeyValueArrayField';
import {FieldRow} from '../FieldRow';

function typeTitleGetter(type: 'Original' | RequestBodyType) {
	switch (type) {
		case 'Original':
			return 'Original';
		case RequestBodyType.Text:
			return 'Text';
		case RequestBodyType.UrlEncodedForm:
			return 'Url encoded form';
		case RequestBodyType.MultipartFromData:
			return 'Multipart from data';
	}
}

interface RequestMethodFieldProps {
	name: string;
	allowOrigin?: boolean;
}

export const RequestBodyField = memo<RequestMethodFieldProps>(({name, allowOrigin}) => {
	const options = useMemo(() => {
		return allowOrigin ? ['Original', ...requestBodyTypesList] : requestBodyTypesList;
	}, [allowOrigin]);

	return (
		<FieldRow title='Body:'>
			<RadioTabs name={`${name}.type`} options={options} optionTitleGetter={typeTitleGetter}>
				{(tabName: string) => {
					switch (tabName) {
						case RequestBodyType.Text:
							return <TextareaField name={`${name}.textValue`} />;

						case RequestBodyType.UrlEncodedForm:
						case RequestBodyType.MultipartFromData:
							return (
								<KeyValueArrayField
									name={`${name}.formValue`}
									keyNameSuffix='key'
									valueNameSuffix='value'
									keyPlaceholder='Key'
									valuePlaceholder='Value'
								/>
							);

						default:
							return null;
					}
				}}
			</RadioTabs>
		</FieldRow>
	);
});

RequestBodyField.displayName = 'RequestMethodField';
