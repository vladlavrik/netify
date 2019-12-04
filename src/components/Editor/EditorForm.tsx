import * as React from 'react';
import {Formik, FormikHelpers} from 'formik';
import {Rule} from '@/interfaces/Rule';
import {RequestBody, ResponseBody} from '@/interfaces/body';
import {HeadersArray} from '@/interfaces/headers';
import {UrlCompareType} from '@/constants/UrlCompareType';
import {RequestBodyType} from '@/constants/RequestBodyType';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
import {CancelReasons} from '@/constants/CancelReasons';
import {ResourceType} from '@/constants/ResourceType';
import {RequestMethod} from '@/constants/RequestMethod';
import {formSchema} from '@/validation/ruleForm';

interface Props {
	className?: string;
	initialValues?: Rule;
	onSave(rule: Rule): void;
	children: React.ReactNode;
}

interface RuleForm {
	filter: {
		url: {
			value: string;
			compareType: UrlCompareType;
		};
		resourceTypes: ResourceType[];
		methods: RequestMethod[];
	};
	actions: {
		breakpoint: {
			request: boolean;
			response: boolean;
		};
		mutate: {
			request: {
				enabled: boolean;
				endpoint: string;
				method?: RequestMethod;
				headers: HeadersArray;
				body: Omit<RequestBody, 'type'> & {type: RequestBodyType | ''};
			};
			response: {
				enabled: boolean;
				responseLocally: '0' | '1';
				statusCode: string;
				headers: HeadersArray;
				body: Omit<ResponseBody, 'type'> & {type: ResponseBodyType | ''};
			};
		};
		cancel: {
			enabled: boolean;
			reason: CancelReasons;
		};
	}
}


export const EditorForm = React.memo((props: Props) => {
	// Transform a Rule object to form value if it is passed into the props or return empty form value otherwise
	const initialValue = React.useMemo(() => {
		if (!props.initialValues) {
			// return empty form state
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
					breakpoint: {
						request: true,
						response: true,
					},
					mutate: {
						request: {
							enabled: false,
							endpoint: '',
							method: undefined,
							headers: [{name: '', value: ''}],
							body: {
								type: '',
								textValue: '',
								formValue: [{key: '', value: ''}],
							},
						},
						response: {
							enabled: false,
							responseLocally: '0',
							statusCode: '',
							headers: [{name: '', value: ''}],
							body: {
								type: '',
								textValue: '',
								fileValue: undefined,
							},
						},
					},
					cancel: {
						enabled: false,
						reason: CancelReasons.Failed,
					},
				},
			} as RuleForm;
		}

		// compile form state form a rule
		const {id, filter, actions} = props.initialValues;
		const {breakpoint, mutate, cancel} = actions;

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
				breakpoint: {...breakpoint},
				mutate: {
					request: {
						enabled: mutate.request.enabled,
						endpoint: mutate.request.endpoint,
						method: mutate.request.method,
						headers: [
							...mutate.request.headers.add,
							...mutate.request.headers.remove.map(name => ({name, value: ''})),
							{name: '', value: ''},
						],
						body: {
							type: mutate.request.body.type || '',
							textValue: mutate.request.body.textValue,
							formValue:
								mutate.request.body.formValue.length > 0
									? mutate.request.body.formValue
									: [{key: '', value: ''}],
						},
					},
					response: {
						enabled: mutate.response.enabled,
						responseLocally: mutate.response.responseLocally ? '1' : '0',
						statusCode: mutate.response.statusCode || '',
						headers: [
							...mutate.response.headers.add,
							...mutate.response.headers.remove.map(name => ({name, value: ''})),
							{name: '', value: ''},
						],
						body: {
							type: mutate.response.body.type || '',
							textValue: mutate.response.body.textValue,
							fileValue: mutate.response.body.fileValue,
						},
					}
				},
				cancel: {
					enabled: cancel.enabled,
					reason: cancel.reason,
				},
			},
		} as RuleForm;
	}, [props.initialValues]);

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
