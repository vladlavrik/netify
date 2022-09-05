import React, {memo, useMemo} from 'react';
import {ResponseBodyType, responseBodyTypesHumanTitles, responseBodyTypesList} from '@/constants/ResponseBodyType';
import {FieldError} from '@/components/@common/forms/FieldError';
import {FileField} from '@/components/@common/forms/FileField';
import {RadioTabs} from '@/components/@common/forms/RadioTabs';
import {TextareaField} from '@/components/@common/forms/TextareaField';
import {FieldRow} from '../FieldRow';

function typeTitleGetter(type: 'Original' | ResponseBodyType) {
	if (type === 'Original') {
		return 'Original';
	}
	return responseBodyTypesHumanTitles[type];
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
				{(tabName) => {
					switch (tabName) {
						case ResponseBodyType.Text:
						case ResponseBodyType.Base64:
							return (
								<>
									<TextareaField name={`${name}.textValue`} />
									<FieldError name={`${name}.textValue`} />
								</>
							);

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
