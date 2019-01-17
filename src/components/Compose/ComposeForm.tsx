import * as React from 'react';
import {Formik, FormikActions, Form} from 'formik';
import * as yup from 'yup';
import {trimString} from '@/helpers/formatter';
import {randomHex} from '@/helpers/random';
import {Rule} from '@/debugger/interfaces/Rule';
import {UrlCompareType, urlCompareTypeList} from '@/debugger/constants/UrlCompareType';
import {ResourceType, resourceTypesList} from '@/debugger/constants/ResourceType';
import {RequestMethod, requestMethodsList} from '@/debugger/constants/RequestMethod';
import {RequestBodyType, requestBodyTypesList} from '@/debugger/constants/RequestBodyType';
import {CancelReasons, cancelReasonsList} from '@/debugger/constants/CancelReasons';

interface Props {
	className?: string;
	onSave: (rule: Rule) => void;
}

const bodySchema = yup.object({
	enabled: yup.bool(),
	type: yup.mixed().oneOf(requestBodyTypesList),
	value: yup.string(),
});

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
			headers: headersSchema,
			replaceBody: bodySchema,
		}),
		mutateResponse: yup.object({
			enabled: yup.boolean(),
			responseLocally: yup.bool(),
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
			replaceBody: bodySchema,
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
			headers: {
				name: string;
				value: string;
			}[];
			replaceBody: {
				type: RequestBodyType;
				value: string;
			};
		};
		mutateResponse: {
			enabled: boolean;
			mode: 'server' | 'locally';
			statusCode: string;
			headers: {
				name: string;
				value: string;
			}[];
			replaceBody: {
				type: RequestBodyType;
				value: string;
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
				enabled: false,
				endpointReplace: '',
				headers: [{
					name: '',
					value: '',
				}],
				replaceBody: {
					type: RequestBodyType.Text,
					value: '',
				},
			},
			mutateResponse: {
				enabled: true,
				mode: 'server' as FormValue['actions']['mutateResponse']['mode'],
				statusCode: '',
				headers: [{
					name: '',
					value: '',
				}],
				replaceBody: {
					type: RequestBodyType.Text,
					value: '',
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

		// workaround to future "Formik" future fix https://github.com/jaredpalmer/formik/pull/728
		const values = formSchema.cast(rawValues);

		this.props.onSave(values);
	};
}
