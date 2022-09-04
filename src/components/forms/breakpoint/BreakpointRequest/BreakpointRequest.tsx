import * as React from 'react';
import {formSchema} from '@/validation/requestForm';
import {RequestBreakpoint} from '@/interfaces/breakpoint';
import {HeadersArray} from '@/interfaces/headers';
import {RequestBody} from '@/interfaces/body';
import {RequestMethod} from '@/constants/RequestMethod';
import {RequestBodyType, requestBodyTypesList} from '@/constants/RequestBodyType';
import {requestMethodsList} from '@/constants/RequestMethod';
import {Button} from '@/components/@common/Button';
import {TextareaField} from '@/components/@common/TextaredField';
import {KeyValueArrayField} from '@/components/@common/KeyValueArrayField';
import {TextField} from '@/components/@common/TextField';
import {DropdownPicker} from '@/components/@common/DropdownPicker';
import {RadioTabs} from '@/components/@common/RadioTabs';
import {FieldError} from '@/components/@common/FieldError';
import {BreakpointScaffold} from './BreakpointScaffold';
import {BreakpointRow} from './BreakpointRow';
import styles from './BreakpointRequest.css';

interface Props {
	data: RequestBreakpoint;
	onExecute(mutatedData: RequestBreakpoint): void;
	onLocalResponse(breakpoint: RequestBreakpoint): void;
	onAbort(breakpoint: RequestBreakpoint): void;
}

interface BreakpointForm {
	requestId: string;
	url: string;
	method: RequestMethod;
	headers: HeadersArray;
	body: Omit<RequestBody, 'type'> & {type?: RequestBodyType | ''};
}

const bodyTypeOptions = requestBodyTypesList.map(type => ({
	value: type,
	title: type,
}));

const bodyTypeOptionsWithEmpty = [{value: '', title: 'Original'}, ...bodyTypeOptions];

export const BreakpointRequest = React.memo(({data, onExecute, onLocalResponse, onAbort}: Props) => {
	const parsedData = React.useMemo<BreakpointForm>(
		() => ({
			...data,
			headers: [...data.headers, {name: '', value: ''}],
			body: {
				type: data.body.type || '',
				textValue: data.body.textValue,
				formValue: [...data.body.formValue, {key: '', value: ''}],
			},
		}),
		[data],
	);

	const handleLocalResponse = React.useCallback(() => onLocalResponse(data), [data, onLocalResponse]);
	const handleAbort = React.useCallback(() => onAbort(data), [data, onAbort]);

	return (
		<BreakpointScaffold<BreakpointForm>
			data={parsedData}
			validationSchema={formSchema}
			title='Response breakpoint'
			requestId={parsedData.requestId}
			controls={
				<>
					<Button className={styles.buttonExecute} withIcon type='submit'>
						Execute
					</Button>
					<Button className={styles.buttonResponse} withIcon onClick={handleLocalResponse}>
						Response locally
					</Button>
					<Button className={styles.buttonAbort} withIcon onClick={handleAbort}>
						Abort
					</Button>
				</>
			}
			onSubmit={onExecute}>
			<BreakpointRow title='Endpoint:'>
				<div>
					<TextField className={styles.urlField} name='url' />
					<FieldError name='url' />
				</div>
			</BreakpointRow>
			<BreakpointRow title='Method:'>
				<DropdownPicker className={styles.methodField} name='method' options={requestMethodsList} />
			</BreakpointRow>
			<BreakpointRow title='Headers:'>
				<KeyValueArrayField
					name='headers'
					keyNameSuffix='name'
					valueNameSuffix='value'
					keyPlaceholder='Header name'
					valuePlaceholder='Header value'
				/>
			</BreakpointRow>
			<BreakpointRow title='Body:'>
				{/*TODO show message about possibly lost post data*/}
				<RadioTabs radioName='body.type' tabs={data.body.type ? bodyTypeOptions : bodyTypeOptionsWithEmpty}>
					{(tabName: string) => {
						switch (tabName) {
							case RequestBodyType.Text:
								return (
									<TextareaField className={styles.bodyTextField} name={'body.textValue'} rows={10} />
								);

							case RequestBodyType.UrlEncodedForm:
							case RequestBodyType.MultipartFromData:
								return (
									<KeyValueArrayField
										name='body.formValue'
										keyNameSuffix='key'
										valueNameSuffix='value'
										keyPlaceholder='Field key'
										valuePlaceholder='Field value'
									/>
								);
							default:
								return null;
						}
					}}
				</RadioTabs>
			</BreakpointRow>
		</BreakpointScaffold>
	);
});
