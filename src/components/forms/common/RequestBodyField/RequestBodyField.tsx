import React, {memo, useMemo} from 'react';
import {RequestBodyType, requestBodyTypesList} from '@/constants/RequestBodyType';
import {RadioTabs} from '@/components/@common/forms/RadioTabs';
import {TextareaField} from '@/components/@common/forms/TextaredField';
import {KeyValueArrayField} from '@/components/@common/forms/KeyValueArrayField';
import {FieldRow} from '../FieldRow';

// TODO use display name getter
const typeOptions = requestBodyTypesList.map(type => ({
	value: type,
	title: type,
}));

const originTypeOption = {value: '', title: 'Original'};

interface RequestMethodFieldProps {
	name: string;
	allowOrigin?: boolean;
}

export const RequestBodyField = memo(({name, allowOrigin}: RequestMethodFieldProps) => {
	const options = useMemo(() => (allowOrigin ? [originTypeOption, ...typeOptions] : typeOptions), [allowOrigin]);

	return (
		<FieldRow title='Body:'>
			<RadioTabs radioName={`${name}.type`} tabs={options}>
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
