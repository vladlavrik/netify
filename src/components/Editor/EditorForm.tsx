import * as React from 'react';
import {Formik, FormikActions, Form} from 'formik';
import {Rule} from '@/interfaces/Rule';
import {FormValue} from './FormValue';
import {formSchema} from './formSchema';
import {UrlCompareType} from '@/constants/UrlCompareType';
import {RequestBodyType} from '@/constants/RequestBodyType';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
import {CancelReasons} from '@/constants/CancelReasons';

interface Props {
	className?: string;
	initialValues?: Rule;
	onSave: (rule: Rule) => any;
}

interface State {
	formInitialValue: FormValue;
}

export class EditorForm extends React.PureComponent<Props, State> {
	state: State = {
		formInitialValue: {
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
		},
	};

	static getDerivedStateFromProps(props: Props) {
		if (props.initialValues) {
			const {id, filter, actions} = props.initialValues;

			return {
				formInitialValue: {
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
							],
							bodyReplace: {
								type: actions.mutateRequest.bodyReplace.type,
								textValue: actions.mutateRequest.bodyReplace.textValue,
								formValue: actions.mutateRequest.bodyReplace.formValue,
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
				},
			};
		}

		return null;
	}

	render() {
		return (
			<Formik
				validateOnBlur={true}
				validateOnChange={false}
				initialValues={this.state.formInitialValue}
				validationSchema={formSchema}
				onSubmit={this.onSubmit}>
				<Form className={this.props.className}>{this.props.children}</Form>
			</Formik>
		);
	}

	private onSubmit = (rawValues: FormValue, a: FormikActions<FormValue>) => {
		a.setSubmitting(false);

		// workaround to "Formik" future fix https://github.com/jaredpalmer/formik/pull/728
		const values = formSchema.cast(rawValues);

		this.props.onSave(values);
	};
}
