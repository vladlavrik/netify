import React, {useCallback, useEffect, useMemo} from 'react';
import {FormikProvider, useFormik} from 'formik';
import {toJS} from 'mobx';
import {observer} from 'mobx-react-lite';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
import {ResponseBody} from '@/interfaces/body';
import {ResponseBreakpoint} from '@/interfaces/breakpoint';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {KeyValueArrayField} from '@/components/@common/forms/KeyValueArrayField';
import {ResponseBodyField} from '@/components/@common/formsKit/ResponseBodyField';
import {StatusCodeField} from '@/components/@common/formsKit/StatusCodeField';
import {useStores} from '@/stores/useStores';
import {BreakpointResponseFormSchema, breakpointResponseFormSchema} from './breakpointResponseFormSchema';
import ExecuteIcon from './icons/execute.svg';
import styles from './breakpointResponse.css';

interface BreakpointResponseProps {
	breakpoint: ResponseBreakpoint;
}

export const BreakpointResponse = observer<BreakpointResponseProps>((props) => {
	const {breakpoint} = props;
	const {breakpointsStore} = useStores();

	const initialValues = useMemo<BreakpointResponseFormSchema>(() => {
		const {statusCode, headers, body} = breakpoint.data;
		return {
			statusCode,
			headers: toJS(headers),
			body: {
				type: body.type,
				textValue:
					body.type === ResponseBodyType.Text || body.type === ResponseBodyType.Base64 ? body.value : '',
				fileValue: body.type === ResponseBodyType.File ? body.value : undefined,
			},
		};
	}, [breakpoint.requestId, breakpoint.stage]);

	const handleSubmit = useCallback(
		(valueSource: BreakpointResponseFormSchema) => {
			const {statusCode, headers, body: bodySource} = breakpointResponseFormSchema.cast(valueSource);

			let body: ResponseBody;

			switch (bodySource.type) {
				case ResponseBodyType.File:
					body = {
						type: bodySource.type,
						value: bodySource.fileValue!,
					};
					break;
				case ResponseBodyType.Text:
				case ResponseBodyType.Base64:
					body = {
						type: bodySource.type,
						value: bodySource.textValue,
					};
					break;
				default:
					body = {
						type: ResponseBodyType.Text,
						value: '',
					};
					break;
			}

			breakpointsStore.removeBreakpoint(breakpoint);
			breakpoint.fulfill({statusCode, headers, body});
		},
		[breakpoint.requestId],
	);

	const form = useFormik({
		validationSchema: breakpointResponseFormSchema,
		initialValues,
		onSubmit: handleSubmit,
	});

	// Update content type and content length headers on a file value change
	useEffect(() => {
		if (!form.values.body.fileValue || form.values.body.fileValue === initialValues.body.fileValue) {
			return;
		}

		const setHeader = (name: string, value: string) => {
			const headerIndex = form.values.headers.findIndex((item) => item.name.toLowerCase() === name.toLowerCase());
			if (headerIndex !== -1) {
				form.setFieldValue(`headers.${headerIndex}.value`, value);
			} else {
				form.setFieldValue(`headers.${form.values.headers.length}`, {name, value});
			}
		};

		const {type, size} = form.values.body.fileValue;
		setHeader('Content-Type', type);
		setHeader('Content-Length', size.toString());
	}, [form.values.body.fileValue]);

	// TODO UPDATE content length on text content change
	// TODO UPDATE content type on type change

	return (
		<FormikProvider value={form}>
			<form className={styles.root} onSubmit={form.handleSubmit}>
				<div className={styles.controls}>
					<IconButton className={styles.control} icon={<ExecuteIcon />} outline type='submit'>
						Send response
					</IconButton>
				</div>

				<div className={styles.row}>
					<p className={styles.rowTitle}>Endpoint:</p>
					<StatusCodeField name='statusCode' />
				</div>
				<div className={styles.row}>
					<p className={styles.rowTitle}>Headers:</p>
					<KeyValueArrayField
						name='headers'
						keyNameSuffix='name'
						valueNameSuffix='value'
						keyPlaceholder='Header name'
						valuePlaceholder='Header value'
					/>
				</div>
				<div className={styles.row}>
					<p className={styles.rowTitle}>Body:</p>
					<ResponseBodyField name='body' />
				</div>
			</form>
		</FormikProvider>
	);
});

BreakpointResponse.displayName = 'BreakpointResponse';
