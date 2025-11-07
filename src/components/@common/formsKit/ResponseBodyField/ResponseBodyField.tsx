import React, {memo, useMemo} from 'react';
import {useField} from 'formik';
import {ResponseBodyType, responseBodyTypesHumanTitles, responseBodyTypesList} from '@/constants/ResponseBodyType';
import {FieldError} from '@/components/@common/forms/FieldError';
import {FileField} from '@/components/@common/forms/FileField';
import {RadioGroup} from '@/components/@common/forms/RadioGroup';
import {TextareaField} from '@/components/@common/forms/TextareaField';
import {JSONEditor} from '@/components/@common/misc/JSONEditor';
import styles from './responseBodyField.css';

function typeTitleGetter(type: 'Original' | ResponseBodyType) {
	if (type === 'Original') {
		return 'Original';
	}
	return responseBodyTypesHumanTitles[type];
}

interface ResponseBodyFieldProps {
	name: string;
	fileFieldNote?: string;
	allowOrigin?: boolean;
}

export const ResponseBodyField = memo<ResponseBodyFieldProps>((props) => {
	const {name, fileFieldNote, allowOrigin} = props;

	const options = useMemo(() => {
		return allowOrigin ? ['Original', ...responseBodyTypesList] : responseBodyTypesList;
	}, [allowOrigin]);

	const [typeField] = useField(`${name}.type`);
	const [textValueField, , textValueHelpers] = useField(`${name}.textValue`);

	return (
		<div className={styles.root}>
			<RadioGroup options={options} optionTitleGetter={typeTitleGetter} {...typeField} />

			{(typeField.value === ResponseBodyType.Text || typeField.value === ResponseBodyType.Base64) && (
				<>
					<TextareaField {...textValueField} />
					<FieldError name={`${name}.textValue`} />
				</>
			)}

			{typeField.value === ResponseBodyType.JSON && (
				<JSONEditor value={textValueField.value} onChange={textValueHelpers.setValue} />
			)}

			{typeField.value === ResponseBodyType.File && <FileField name={`${name}.fileValue`} note={fileFieldNote} />}
		</div>
	);
});

ResponseBodyField.displayName = 'ResponseBodyField';
