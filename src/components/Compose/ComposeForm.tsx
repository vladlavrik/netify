import * as React from 'react';
import {Formik, FormikActions, Form} from 'formik';
import * as yup from 'yup';
import {trimString} from '@/helpers/formatter';
import {randomHex} from '@/helpers/random';
import {Rule} from '@/interfaces/Rule';
import {UrlCompareType, urlCompareTypeList} from '@/constants/UrlCompareType';
import {ResourceType, resourceTypesList} from '@/constants/ResourceType';
import {RequestMethod, requestMethodsList} from '@/constants/RequestMethod';
import {RequestBodyType, requestBodyTypesList} from '@/constants/RequestBodyType';
import {ResponseBodyType, responseBodyTypesList} from '@/constants/ResponseBodyType';
import {CancelReasons, cancelReasonsList} from '@/constants/CancelReasons';

interface Props {
	className?: string;
	onSave: (rule: Rule) => void;
}

const headersSchema = yup.mixed().transform((value: {name: string, value: string}[]) => {
	const add: {[name: string]: string} = {};
	const remove: string[] = [];

	for (const item of value) {
		const name = trimString(item.name);
		const value = trimString(item.value);

		if (name && value) {
			add[name] = value;
		} else if (name) {
			remove.push(name);
		}
	}
	return {add, remove};
});

const formSchema = yup.object<Rule>({
	id: yup.string().default(() => randomHex(16)),
	filter: yup.object({
		url: yup.object({
			value: yup.string(),
			compareType: yup.mixed().oneOf(urlCompareTypeList),
		}),
		resourceTypes: yup.array().of(yup.mixed().oneOf(resourceTypesList)),
		methods: yup.array().of(yup.mixed().oneOf(requestMethodsList)),
	}),
	actions: yup.object({
		mutateRequest: yup.object({
			enabled: yup.boolean(),
			endpointReplace: yup.string(),
			methodReplace: yup.mixed().oneOf(requestMethodsList).nullable(true),
			headers: headersSchema,
			bodyReplace: yup.object({
				type: yup.mixed().oneOf(requestBodyTypesList),
				textValue: yup.string(),
				formValue: yup
					.array().of(yup.object({
						key: yup.string(),
						value: yup.string(),
					}))
					.transform((values: {key: string, value: string}[]) => {
						// clean empty items
						return values.filter(({key}) => trimString(key).length > 0)
					}),
			}),
		}),
		mutateResponse: yup.object({
			enabled: yup.boolean(),
			responseLocally: yup.mixed().transform((value: '0' | '1') => value === '1'),
			statusCode: yup.mixed()
				.transform((value: string) => {
					if (value === '') {
						return null;
					}
					if (!isNaN(+value)) {
						return +value;
					}
					return value;
				})
				.test(
					'typeError',
					'Status code must be a number value in range 100 - 599',
					(value: null | number| string) => {
						return value === null || typeof value === 'number' && value >=100 && value < 600;
					},
				),
			headers: headersSchema,
			bodyReplace: yup.object({
				type: yup.mixed().oneOf(responseBodyTypesList),
				textValue: yup.string(),
				blobValue: yup.mixed().nullable(false),
			}),
		}),
		cancelRequest: yup.object({
			enabled: yup.boolean(),
			reason: yup.mixed().oneOf(cancelReasonsList),
		}),
	}),
});

interface FormValue {
	filter: {
		url: {
			value: string
			compareType: UrlCompareType;
		};
		resourceTypes: ResourceType[];
		methods: RequestMethod[];
	};
	actions: {
		mutateRequest: {
			enabled: boolean;
			endpointReplace: string;
			methodReplace?: RequestMethod;
			headers: {name: string, value: string;}[];
			bodyReplace: {
				type: RequestBodyType;
				textValue: string;
				formValue: {key: string, value: string;}[];
			};
		};
		mutateResponse: {
			enabled: boolean;
			responseLocally: '0' | '1';
			statusCode: string;
			headers: {name: string, value: string}[];
			bodyReplace: {
				type: ResponseBodyType;
				textValue: string;
				blobValue?: Blob;
			};
		};
		cancelRequest: {
			enabled: boolean;
			reason: CancelReasons;
		};
	}
}

export class ComposeForm extends React.PureComponent<Props> {
	formInitialValue: FormValue = {
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
				enabled: true,
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
				enabled: false,
				responseLocally: '0',
				statusCode: '',
				headers: [{
					name: '',
					value: '',
				}],
				bodyReplace: {
					type: ResponseBodyType.Original,
					textValue: '',
					blobValue: undefined,
				},
			},
			cancelRequest: {
				enabled: false,
				reason: CancelReasons.Failed,
			},
		},
	};

	render() {
		return (
			<Formik
				validateOnBlur={true}
				validateOnChange={false}
				initialValues={this.formInitialValue}
				validationSchema={formSchema}
				onSubmit={this.onSubmit}>
				<Form className={this.props.className}>
					{this.props.children}
				</Form>
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
