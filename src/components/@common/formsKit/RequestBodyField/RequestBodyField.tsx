import React, {memo, useMemo} from 'react';
import {useField} from 'formik';
import {RequestBodyType, requestBodyTypesList, responseBodyTypesHumanTitles} from '@/constants/RequestBodyType';
import {KeyValueArrayField} from '@/components/@common/forms/KeyValueArrayField';
import {RadioGroup} from '@/components/@common/forms/RadioGroup';
import {TextareaField} from '@/components/@common/forms/TextareaField';
import styles from './requestBodyField.css';

function typeTitleGetter(type: 'Original' | RequestBodyType) {
	if (type === 'Original') {
		return 'Original';
	}

	return responseBodyTypesHumanTitles[type];
}

interface RequestMethodFieldProps {
	name: string;
	allowOrigin?: boolean;
}

export const RequestBodyField = memo<RequestMethodFieldProps>(({name, allowOrigin}) => {
	const options = useMemo(() => {
		return allowOrigin ? ['Original', ...requestBodyTypesList] : requestBodyTypesList;
	}, [allowOrigin]);

	const [typeField] = useField(`${name}.type`);
	const [textValueField] = useField(`${name}.textValue`);

	// TODO add file option
	return (
		<div className={styles.root}>
			<RadioGroup options={options} optionTitleGetter={typeTitleGetter} {...typeField} />
			{typeField.value === RequestBodyType.Text && <TextareaField {...textValueField} />}

			{(typeField.value === RequestBodyType.UrlEncodedForm ||
				typeField.value === RequestBodyType.MultipartFromData) && (
				<KeyValueArrayField
					name={`${name}.formValue`}
					keyNameSuffix='key'
					valueNameSuffix='value'
					keyPlaceholder='Key'
					valuePlaceholder='Value'
				/>
			)}
		</div>
	);
});

RequestBodyField.displayName = 'RequestBodyField';
