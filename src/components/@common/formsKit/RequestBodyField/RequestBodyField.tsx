import React, {memo, useMemo} from 'react';
import {useField} from 'formik';
import {RequestBodyType, requestBodyTypesList, responseBodyTypesHumanTitles} from '@/constants/RequestBodyType';
import {useAutoDetectJSON} from '@/hooks/useAutoDetectJSON';
import {FieldError} from '@/components/@common/forms/FieldError';
import {KeyValueArrayField} from '@/components/@common/forms/KeyValueArrayField';
import {RadioGroup} from '@/components/@common/forms/RadioGroup';
import {TextareaField} from '@/components/@common/forms/TextareaField';
import {JSONEditor} from '@/components/@common/misc/JSONEditor';
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

	const [typeField, , typeHelpers] = useField(`${name}.type`);
	const [textValueField, , textValueHelpers] = useField(`${name}.textValue`);

	// Auto-detect JSON on initial load
	useAutoDetectJSON(
		typeField.value,
		textValueField.value,
		RequestBodyType.Text,
		(prettifiedJSON) => {
			typeHelpers.setValue(RequestBodyType.JSON);
			textValueHelpers.setValue(prettifiedJSON);
		},
	);

	// TODO add file option
	return (
		<div className={styles.root}>
			<RadioGroup options={options} optionTitleGetter={typeTitleGetter} {...typeField} />
			{typeField.value === RequestBodyType.Text && <TextareaField {...textValueField} />}

			{typeField.value === RequestBodyType.JSON && (
				<JSONEditor value={textValueField.value} onChange={textValueHelpers.setValue} />
			)}

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
