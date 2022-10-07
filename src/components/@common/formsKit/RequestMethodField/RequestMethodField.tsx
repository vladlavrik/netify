import React, {memo} from 'react';
import {useField} from 'formik';
import {requestMethodsList} from '@/constants/RequestMethod';
import {SelectField} from '@/components/@common/forms/SelectField';

const optionTitleGetter = (value: string) => value || 'Original';

interface RequestMethodFieldProps {
	name: string;
	allowEmpty?: boolean;
}

export const RequestMethodField = memo<RequestMethodFieldProps>((props) => {
	const {name, allowEmpty} = props;
	const [field] = useField(name);
	const options = allowEmpty ? ['', ...requestMethodsList] : requestMethodsList;

	return <SelectField options={options} optionTitleGetter={optionTitleGetter} {...field} />;
});

RequestMethodField.displayName = 'RequestMethodField';
