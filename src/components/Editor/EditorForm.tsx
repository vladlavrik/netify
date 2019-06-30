import * as React from 'react';
import {Formik, FormikHelpers} from 'formik';
import {Rule} from '@/interfaces/Rule';
import {RuleForm} from '@/interfaces/RuleForm';
import {formSchema} from '@/validation/ruleForm';
import {UrlCompareType} from '@/constants/UrlCompareType';
import {RequestBodyType} from '@/constants/RequestBodyType';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
import {CancelReasons} from '@/constants/CancelReasons';

interface Props {
	className?: string;
	initialValues?: Rule;
	onSave(rule: Rule): void;
	children: React.ReactNode;
}

export const EditorForm = React.memo((props: Props) => {
	// Transform a Rule object to form value is it is passed into props or return empty form value
	const initialValue = React.useMemo(
		() => {
			if (!props.initialValues) {
				return {
					filter: {
						url: {
							value: '',
							compareType: UrlCompareType.StartsWith,
						},
						resourceTypes: [],
						methods: [],
					},
					actions: {
						mutateRequest: {
							enabled: false,
							endpointReplace: '',
							methodReplace: undefined,
							headers: [{name: '', value: ''}],
							bodyReplace: {
								type: RequestBodyType.Original,
								textValue: '',
								formValue: [{key: '', value: ''}],
							},
						},
						mutateResponse: {
							enabled: true,
							responseLocally: '0',
							statusCode: '',
							headers: [{name: '', value: ''}],
							bodyReplace: {
								type: ResponseBodyType.Original,
								textValue: '',
								fileValue: undefined,
							},
						},
						cancelRequest: {
							enabled: false,
							reason: CancelReasons.Failed,
						},
					},
				} as RuleForm;
			}

			const {id, filter, actions} = props.initialValues;
			return {
				id,
				filter: {
					url: {
						value: filter.url.value,
						compareType: filter.url.compareType,
					},
					resourceTypes: filter.resourceTypes,
					methods: filter.methods,
				},
				actions: {
					mutateRequest: {
						enabled: actions.mutateRequest.enabled,
						endpointReplace: actions.mutateRequest.endpointReplace,
						methodReplace: actions.mutateRequest.methodReplace,
						headers: [
							...Object.entries(actions.mutateRequest.headers.add).map(
								([name, value]: [string, string]) => ({name, value}),
							),
							...actions.mutateRequest.headers.remove.map(name => ({name, value: ''})),
							{name: '', value: ''},
						],
						bodyReplace: {
							type: actions.mutateRequest.bodyReplace.type,
							textValue: actions.mutateRequest.bodyReplace.textValue,
							formValue:
								actions.mutateRequest.bodyReplace.formValue.length > 0
									? actions.mutateRequest.bodyReplace.formValue
									: [{key: '', value: ''}],
						},
					},
					mutateResponse: {
						enabled: actions.mutateResponse.enabled,
						responseLocally: actions.mutateResponse.responseLocally ? '1' : '0',
						statusCode: actions.mutateResponse.statusCode || '',
						headers: [
							...Object.entries(actions.mutateResponse.headers.add).map(
								([name, value]: [string, string]) => ({name, value}),
							),
							...actions.mutateResponse.headers.remove.map(name => ({name, value: ''})),
							{name: '', value: ''},
						],
						bodyReplace: {
							type: actions.mutateResponse.bodyReplace.type,
							textValue: actions.mutateResponse.bodyReplace.textValue,
							fileValue: actions.mutateResponse.bodyReplace.fileValue,
						},
					},
					cancelRequest: {
						enabled: actions.cancelRequest.enabled,
						reason: actions.cancelRequest.reason,
					},
				},
			} as RuleForm;
		},
		[props.initialValues],
	);

	const onSubmit = React.useCallback(
		(rawValues: RuleForm, form: FormikHelpers<RuleForm>) => {
			form.setSubmitting(false);
			const values = formSchema.cast(rawValues); // workaround to "Formik" future fix https://github.com/jaredpalmer/formik/pull/728
			props.onSave(values);
		},
		[props.onSave],
	);

	return (
		<Formik<RuleForm>
			validateOnBlur={true}
			validateOnChange={false}
			initialValues={initialValue}
			validationSchema={formSchema}
			onSubmit={onSubmit}>
			{({handleSubmit}) => (
				<form className={props.className} onSubmit={handleSubmit}>
					{props.children}
				</form>
			)}
		</Formik>
	);
});
