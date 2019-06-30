import * as React from 'react';
import {ObjectSchema} from 'yup';
import {Formik, FormikHelpers} from 'formik';
import styles from './interceptorScaffold.css';

interface Props<TData extends Record<string, any>> {
	data: TData;
	validationSchema: ObjectSchema<TData>;
	title: string;
	controls: React.ReactNode;
	children: React.ReactNode;
	onSubmit(mutatedData: TData): void;
}

// TODO add select of active intercepted request
export function InterceptorScaffold<TData>(props: Props<TData>) {
	const {data, validationSchema, title, controls, children} = props;

	const onSubmit = React.useCallback(
		(rawValues: TData, form: FormikHelpers<TData>) => {
			form.setSubmitting(false);
			const values = validationSchema.cast(rawValues); // workaround to "Formik" future fix https://github.com/jaredpalmer/formik/pull/728
			props.onSubmit(values);
		},
		[validationSchema, props.onSubmit],
	);

	return (
		<div className={styles.root}>
			<Formik
				validateOnBlur={true}
				validateOnChange={false}
				initialValues={data}
				validationSchema={validationSchema}
				onSubmit={onSubmit}>
				{({handleSubmit}) => (
					<form className={styles.form} onSubmit={handleSubmit}>
						<div className={styles.header}>
							<h3 className={styles.title}>{title}</h3>
							{controls}
						</div>

						<div className={styles.content}>{children}</div>
					</form>
				)}
			</Formik>
		</div>
	);
}
