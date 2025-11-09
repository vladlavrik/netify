import React, {useCallback, useMemo} from 'react';
import {FormikProvider, useFormik} from 'formik';
import {toJS} from 'mobx';
import {observer} from 'mobx-react-lite';
import {RequestBodyType} from '@/constants/RequestBodyType';
import {requestMethodsList} from '@/constants/RequestMethod';
import {ResponseErrorReason} from '@/constants/ResponseErrorReason';
import {RequestBody} from '@/interfaces/body';
import {RequestBreakpoint} from '@/interfaces/breakpoint';
import {useStores} from '@/stores/useStores';
import {InlineButton} from '@/components/@common/buttons/InlineButton';
import {TextButton} from '@/components/@common/buttons/TextButton';
import {FieldError} from '@/components/@common/forms/FieldError';
import {KeyValueArrayField} from '@/components/@common/forms/KeyValueArrayField';
import {SelectField} from '@/components/@common/forms/SelectField';
import {TextField} from '@/components/@common/forms/TextField';
import {RequestBodyField} from '@/components/@common/formsKit/RequestBodyField';
import {BreakpointRequestFormSchema, breakpointRequestFormSchema} from './breakpointRequestFormSchema';
import AbortIcon from '@/assets/icons/close.svg';
import ExecuteIcon from '@/assets/icons/execute.svg';
import styles from './breakpointRequest.css';

interface BreakpointRequestProps {
	breakpoint: RequestBreakpoint;
}

export const BreakpointRequest = observer<BreakpointRequestProps>((props) => {
	const {breakpoint} = props;

	const {breakpointsStore} = useStores();

	const initialValues = useMemo<BreakpointRequestFormSchema>(() => {
		const {url, method, headers, body} = breakpoint.data;
		return {
			endpoint: url,
			method,
			headers: toJS(headers),
			body: {
				type: body?.type || 'Original',
				textValue: body?.type === RequestBodyType.Text || body?.type === RequestBodyType.JSON ? body.value : '',
				formValue:
					body?.type === RequestBodyType.MultipartFromData || body?.type === RequestBodyType.UrlEncodedForm
						? toJS(body.value)
						: [{key: '', value: ''}],
			},
		};
	}, [breakpoint.requestId, breakpoint.stage]);

	const handleSubmit = useCallback(
		(valueSource: BreakpointRequestFormSchema) => {
			const {endpoint, method, headers, body: bodySource} = breakpointRequestFormSchema.cast(valueSource);

			// TODO validate endpoint

			let body: RequestBody | undefined;

			switch (bodySource.type) {
				case RequestBodyType.MultipartFromData:
				case RequestBodyType.UrlEncodedForm:
					body = {
						type: bodySource.type,
						value: bodySource.formValue,
					};
					break;
				case RequestBodyType.Text:
				case RequestBodyType.JSON:
					body = {
						type: bodySource.type,
						value: bodySource.textValue,
					};
					break;
			}

			breakpointsStore.removeBreakpoint(breakpoint);
			breakpoint.continue({url: endpoint, method, headers, body});
		},
		[breakpoint.requestId],
	);

	const handleFailure = () => {
		breakpointsStore.removeBreakpoint(breakpoint);
		breakpoint.failure(ResponseErrorReason.Aborted);
	};

	const form = useFormik<BreakpointRequestFormSchema>({
		validationSchema: breakpointRequestFormSchema,
		initialValues,
		onSubmit: handleSubmit,
	});

	const handleUnlockBody = () => {
		form.setFieldValue('body.type', RequestBodyType.Text);
	};

	return (
		<FormikProvider value={form}>
			<form className={styles.root} onSubmit={form.handleSubmit}>
				<div className={styles.controls}>
					<TextButton
						icon={<ExecuteIcon />}
						styleType='outlined'
						iconStyleType='accept'
						type='submit'
						outline>
						Send to server
					</TextButton>
					<TextButton
						icon={<AbortIcon />}
						styleType='outlined'
						iconStyleType='dangerous'
						outline
						onClick={handleFailure}>
						Abort
					</TextButton>
					{/* TODO add the local response feature*/}
				</div>

				<div className={styles.row}>
					<p className={styles.rowTitle}>Endpoint:</p>
					<div className={styles.endpointColumn}>
						<TextField
							className={styles.endpointField}
							name='endpoint'
							value={form.values.endpoint}
							onChange={form.handleChange}
							onBlur={form.handleBlur}
						/>
						<FieldError name='endpoint' />
					</div>
				</div>
				<div className={styles.row}>
					<p className={styles.rowTitle}>Method</p>
					<SelectField
						className={styles.methodField}
						name='method'
						options={requestMethodsList}
						value={form.values.method}
						onChange={form.handleChange}
						onBlur={form.handleBlur}
					/>
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
					{form.values.body.type === 'Original' ? (
						<p className={styles.bodyPlaceholder}>
							The body can&apos;t be shown.{' '}
							<InlineButton onClick={handleUnlockBody}>Set the body</InlineButton>
						</p>
					) : (
						<RequestBodyField name='body' />
					)}
				</div>
			</form>
		</FormikProvider>
	);
});

BreakpointRequest.displayName = 'BreakpointRequest';
