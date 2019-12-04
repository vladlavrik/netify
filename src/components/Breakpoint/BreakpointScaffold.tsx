import * as React from 'react';
import {toJS} from 'mobx';
import {ObjectSchema} from 'yup';
import {FormikHelpers, FormikProvider, useFormik} from 'formik';
import {requestMethodsList} from '@/constants/RequestMethod';
import {DropdownPicker} from '@/components/@common/DropdownPicker';
import styles from './breakpointScaffold.css';

interface Props<TData extends Record<string, any>> {
	data: TData;
	validationSchema: ObjectSchema<TData>;
	title: string;
	requestId: string;
	controls: React.ReactNode;
	children: React.ReactNode;
	onSubmit(mutatedData: TData): void;
}

// TODO make some headers readonly because its changes will be  skipped: Cookie, Referer, User-Agent, etc...
export function BreakpointScaffold<TData>(props: Props<TData>) {
	const {data, validationSchema, title, requestId, controls, children} = props;

	const onSubmit = React.useCallback(
		(rawValues: TData, form: FormikHelpers<TData>) => {
			form.setSubmitting(false);
			let values = validationSchema.cast(rawValues); // workaround to "Formik" future fix https://github.com/jaredpalmer/formik/pull/728
			values = toJS(values, {recurseEverything: true});
			props.onSubmit(values);
		},
		[props.data, props.onSubmit, validationSchema],
	);

	const form = useFormik({
		validateOnBlur: true,
		validateOnChange: false,
		initialValues: data,
		validationSchema,
		onSubmit,
	});

	React.useEffect(() => {
		form.setValues(data);
	}, [data]);

	return (
		<div className={styles.root}>
			<FormikProvider value={form}>
				<form className={styles.form} onSubmit={form.handleSubmit}>
					<div className={styles.header}>
						<h3 className={styles.title}>{title}</h3>
						<div>

						</div>
						{controls}
						<DropdownPicker
							className={styles.picker}
							name='requestId'
							options={requestMethodsList}
						/>
						{requestId}
					</div>

					<div className={styles.content}>{children}</div>
				</form>
			</FormikProvider>
		</div>
	);
}
