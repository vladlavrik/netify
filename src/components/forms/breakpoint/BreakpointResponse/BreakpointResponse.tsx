import React, {memo} from 'react';
import {ResponseBreakpoint} from '@/interfaces/breakpoint';
import {HeadersArray} from '@/interfaces/headers';
import {ResponseBody} from '@/interfaces/body';
import {ResponseBodyType, responseBodyTypesList} from '@/constants/ResponseBodyType';
import {formSchema} from '@/forms/b/responseForm';
import {Button} from '@/components/@common/buttons/Button';
import {TextareaField} from '@/components/@common/forms/TextareaField';
import {KeyValueArrayField} from '@/components/@common/forms/KeyValueArrayField';
import {TextField} from '@/components/@common/forms/TextField';
import {RadioTabs} from '@/components/@common/forms/RadioTabs';
import {FileField} from '@/components/@common/forms/FileField';
import {FieldError} from '@/components/@common/forms/FieldError';
import {FieldRow} from '@/components/forms/common/FieldRow';
import {BreakpointForm} from '../BreakpointForm';
import styles from './BreakpointResponse.css';

interface Props {
	data: ResponseBreakpoint;
	onExecute(mutatedData: ResponseBreakpoint): void;
	onAbort(breakpoint: ResponseBreakpoint): void;
}

interface BreakpointFormData {
	requestId: string;
	url: string;
	statusCode: number;
	headers: HeadersArray;
	body: Omit<ResponseBody, 'type'> & {type?: ResponseBodyType | ''};
}

const bodyTypeOptions = responseBodyTypesList.map(type => ({
	value: type,
	title: type,
}));

const bodyTypeOptionsWithEmpty = [{value: '', title: 'Original'}, ...bodyTypeOptions];

export const BreakpointResponse = memo(({data, onExecute, onAbort}: Props) => {
	const parsedData = React.useMemo<BreakpointFormData>(
		() => ({
			...data,
			headers: [...data.headers, {name: '', value: ''}],
			body: {
				...data.body,
				type: data.body.type || '',
			},
		}),
		[data],
	);

	const handleAbort = React.useCallback(() => onAbort(data), [data, onAbort]);

	return (
		<BreakpointForm<ResponseBreakpoint>
			data={parsedData}
			validationSchema={formSchema}
			title='Request breakpoint'
			requestId={parsedData.requestId}
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
			<FieldRow title='Endpoint:'>
				<TextField className={styles.urlField} name='url' readOnly />
			</FieldRow>
			<FieldRow title='Status code:'>
				<div>
					{/*TODO type number*/}
					<TextField className={styles.statusCode} name='statusCode' maxLength={3} />
					<FieldError name='statusCode' />
				</div>
			</FieldRow>
			<FieldRow title='Headers:'>
				<KeyValueArrayField
					name='headers'
					keyNameSuffix='name'
					valueNameSuffix='value'
					keyPlaceholder='Header name'
					valuePlaceholder='Header value'
				/>
			</FieldRow>
			<FieldRow title='Body:'>
				<RadioTabs radioName='body.type' tabs={data.body.type ? bodyTypeOptions : bodyTypeOptionsWithEmpty}>
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
			</FieldRow>
		</BreakpointForm>
	);
});
