import * as React from 'react';
import {ResponseBreakpoint} from '@/interfaces/breakpoint';
import {HeadersArray} from '@/interfaces/headers';
import {ResponseBody} from '@/interfaces/body';
import {ResponseBodyType, responseBodyTypesList} from '@/constants/ResponseBodyType';
import {formSchema} from '@/validation/responseForm';
import {Button} from '@/components/@common/Button';
import {TextareaField} from '@/components/@common/TextaredField';
import {KeyValueArrayField} from '@/components/@common/KeyValueArrayField';
import {TextField} from '@/components/@common/TextField';
import {RadioTabs} from '@/components/@common/RadioTabs';
import {FileField} from '@/components/@common/FileField';
import {FieldError} from '@/components/@common/FieldError';
import {BreakpointScaffold} from './BreakpointScaffold';
import {BreakpointRow} from './BreakpointRow';
import styles from './BreakpointOfResponse.css';

interface Props {
	data: ResponseBreakpoint;
	onExecute(mutatedData: ResponseBreakpoint): void;
	onAbort(breakpoint: ResponseBreakpoint): void;
}

interface BreakpointForm {
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

export const BreakpointOfResponse = React.memo(({data, onExecute, onAbort}: Props) => {
	const parsedData = React.useMemo<BreakpointForm>(
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
		<BreakpointScaffold<ResponseBreakpoint>
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
			<BreakpointRow title='Endpoint:'>
				<TextField className={styles.urlField} name='url' readOnly />
			</BreakpointRow>
			<BreakpointRow title='Status code:'>
				<div>
					{/*TODO type number*/}
					<TextField className={styles.statusCode} name='statusCode' maxlength={3} />
					<FieldError name='statusCode' />
				</div>
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
			</BreakpointRow>
		</BreakpointScaffold>
	);
});
