import * as React from 'react';
import {inject} from 'mobx-react';
import {Formik, FormikActions, Form} from 'formik';
import {AppStore} from '@/components/App';
import {ComposeFilter} from './ComposeFilter';
import {ComposeActionRequest} from './ComposeActionRequest';
import {ComposeActionResponse} from './ComposeActionResponse';
import {ComposeActionCancel} from './ComposeActionCancel';
import {Button} from '@/components/@common/Button';
import {ExpandableCheckbox} from '@/components/@common/ExpandableCheckbox';
import {UrlCompareTypes} from '@/debugger/constants/UrlCompareTypes';
import {RequestTypes} from '@/debugger/constants/RequestTypes';
import {RequestMethods} from '@/debugger/constants/RequestMethods';
import {RequestBodyTypes} from '@/debugger/constants/RequestBodyTypes';
import {CancelReasons} from '@/debugger/constants/CancelReasons';
import styles from './compose.css';

interface Props {
	appStore?: AppStore;
}

interface FormValue {
	filter: {
		url: string;
		urlCompareType: UrlCompareTypes;
		requestTypes: RequestTypes[];
		methods: RequestMethods[];
	};
	mutateRequest: {
		enabled: boolean;
		endpointReplace: string;
		method: RequestMethods;
		headers: {
			name: string;
			value: string;
		}[];
		body: {
			type: RequestBodyTypes;
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
		body: {
			type: RequestBodyTypes;
			value: string;
		};
	};
	responseError: {
		enabled: boolean;
		reason: CancelReasons;
	};
}

@inject('appStore')
export class Compose extends React.Component<Props> {
	formRef = React.createRef<Formik<FormValue>>();

	formInitialValue: FormValue = {
		filter: {
			url: 'https://',
			urlCompareType: UrlCompareTypes.Exact,
			requestTypes: [RequestTypes.Fetch],
			methods: [],
		},
		mutateRequest: {
			enabled: false,
			endpointReplace: '',
			method: RequestMethods.GET,
			headers: [
				{
					name: '',
					value: '',
				},
			],
			body: {
				type: RequestBodyTypes.Text,
				value: '',
			},
		},
		mutateResponse: {
			enabled: false,
			mode: 'server' as FormValue['mutateResponse']['mode'],
			statusCode: '',
			headers: [
				{
					name: '',
					value: '',
				},
			],
			body: {
				type: RequestBodyTypes.Text,
				value: '',
			},
		},
		responseError: {
			enabled: true,
			reason: CancelReasons.Aborted,
		},
	};

	render() {
		return (
			<Formik ref={this.formRef} initialValues={this.formInitialValue} onSubmit={this.onSubmit}>
				<div className={styles.root}>
					<Form className={styles.form}>
						<h3 className={styles.title}>Filter requests:</h3>
						<ComposeFilter />

						<h3 className={styles.title}>Actions:</h3>
						<ExpandableCheckbox name='mutateRequest.enabled' label='Mutate request'>
							<ComposeActionRequest />
						</ExpandableCheckbox>

						<ExpandableCheckbox name='mutateResponse.enabled' label='Mutate Response'>
							<ComposeActionResponse />
						</ExpandableCheckbox>

						<ExpandableCheckbox name='responseError.enabled' label='Cancel'>
							<ComposeActionCancel />
						</ExpandableCheckbox>

						<div className={styles.controls}>
							<Button className={styles.saveButton} type='submit'>
								Save
							</Button>
							<Button styleType='secondary' onClick={this.onCancel}>
								Cancel
							</Button>
						</div>
					</Form>
				</div>
			</Formik>
		);
	}

	onSubmit = (values: FormValue, {setSubmitting}: FormikActions<FormValue>) => {
		setSubmitting(false);
		console.log(values);
	};

	onCancel = () => {
		this.props.appStore!.toggleComposeShow();
	};
}
