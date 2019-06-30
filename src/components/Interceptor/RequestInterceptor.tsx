import * as React from 'react';
import {formSchema} from '@/validation/requestForm';
import {InterceptedRequest} from '@/interfaces/InterceptedRequest';
import {requestBodyRealTypesList, RequestBodyType} from '@/constants/RequestBodyType';
import {requestMethodsList} from '@/constants/RequestMethod';
import {Button} from '@/components/@common/Button';
import {TextareaField} from '@/components/@common/TextaredField';
import {KeyValueArrayField} from '@/components/@common/KeyValueArrayField';
import {TextField} from '@/components/@common/TextField';
import {DropdownPicker} from '@/components/@common/DropdownPicker';
import {RadioTabs} from '@/components/@common/RadioTabs';
import {FieldError} from '@/components/@common/FieldError';
import {InterceptorScaffold} from './InterceptorScaffold';
import {InterceptorRow} from './InterceptorRow';
import styles from './requestInterceptor.css';

interface Props {
	data: InterceptedRequest;
	onExecute(mutatedData: InterceptedRequest): void;
	onLocalResponse(intercepted: InterceptedRequest): void;
	onAbort(intercepted: InterceptedRequest): void;
}

export const RequestInterceptor = React.memo(({data, onExecute, onLocalResponse, onAbort}: Props) => {
	const handleLocalResponse = React.useCallback(() => onLocalResponse(data), [data, onLocalResponse]);

	const handleAbort = React.useCallback(() => onAbort(data), [data, onAbort]);

	return (
		<InterceptorScaffold<InterceptedRequest>
			data={data}
			validationSchema={formSchema}
			title='Intercepted request'
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
			<InterceptorRow title='Endpoint:'>
				<div>
					<TextField className={styles.endpointField} name='endpoint' />
					<FieldError name='endpoint' />
				</div>
			</InterceptorRow>
			<InterceptorRow title='Method:'>
				<DropdownPicker className={styles.methodField} name='method' options={requestMethodsList} />
			</InterceptorRow>
			<InterceptorRow title='Headers:'>
				<KeyValueArrayField
					name='headers'
					keyNameSuffix='name'
					valueNameSuffix='value'
					keyPlaceholder='Header name'
					valuePlaceholder='Header value'
				/>
			</InterceptorRow>
			<InterceptorRow title='Body:'>
				<RadioTabs
					radioName='body.type'
					tabs={requestBodyRealTypesList.map(type => ({
						value: type,
						title: type,
					}))}>
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
			</InterceptorRow>
		</InterceptorScaffold>
	);
});
