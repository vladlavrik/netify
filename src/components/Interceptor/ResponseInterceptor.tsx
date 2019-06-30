import * as React from 'react';
import {formSchema} from '@/validation/responseForm';
import {InterceptedResponse} from '@/interfaces/InterceptedResponse';
import {responseBodyRealTypesList, ResponseBodyType} from '@/constants/ResponseBodyType';
import {Button} from '@/components/@common/Button';
import {TextareaField} from '@/components/@common/TextaredField';
import {KeyValueArrayField} from '@/components/@common/KeyValueArrayField';
import {TextField} from '@/components/@common/TextField';
import {RadioTabs} from '@/components/@common/RadioTabs';
import {FileField} from '@/components/@common/FileField';
import {FieldError} from '@/components/@common/FieldError';
import {InterceptorScaffold} from './InterceptorScaffold';
import {InterceptorRow} from './InterceptorRow';
import styles from './responseInterceptor.css';

interface Props {
	data: InterceptedResponse;
	onExecute(mutatedData: InterceptedResponse): void;
	onAbort(intercepted: InterceptedResponse): void;
}

export const ResponseInterceptor = React.memo(({data, onExecute, onAbort}: Props) => {
	const handleAbort = React.useCallback(() => onAbort(data), [data, onAbort]);

	return (
		<InterceptorScaffold<InterceptedResponse>
			data={data}
			validationSchema={formSchema}
			title='Intercepted request'
			controls={
				<>
					<Button className={styles.buttonExecute} withIcon type='submit'>
						Execute
					</Button>
					<Button className={styles.buttonAbort} withIcon onClick={handleAbort}>
						Abort
					</Button>
				</>
			}
			onSubmit={onExecute}>
			<InterceptorRow title='Status code:'>
				<div>
					{/*TODO type number*/}
					<TextField className={styles.statusCode} name='statusCode' maxlength={3} />
					<FieldError name='statusCode' />
				</div>
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
					tabs={responseBodyRealTypesList.map(type => ({
						value: type,
						title: type,
					}))}>
					{(tabName: string) => {
						switch (tabName) {
							case ResponseBodyType.Text:
							case ResponseBodyType.Base64:
								return (
									<TextareaField className={styles.bodyTextField} name={'body.textValue'} rows={10} />
								);

							case ResponseBodyType.File:
								return <FileField name='body.fileValue' />;

							default:
								return null;
						}
					}}
				</RadioTabs>
			</InterceptorRow>
		</InterceptorScaffold>
	);
});
