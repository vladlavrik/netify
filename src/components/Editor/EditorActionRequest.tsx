import * as React from 'react';
import {RequestBodyType, requestBodyTypesList} from '@/constants/RequestBodyType';
import {requestMethodsList} from '@/constants/RequestMethod';
import {TextField} from '@/components/@common/TextField';
import {DropdownPicker} from '@/components/@common/DropdownPicker';
import {RadioTabs} from '@/components/@common/RadioTabs';
import {TextareaField} from '@/components/@common/TextaredField';
import {KeyValueArrayField} from '@/components/@common/KeyValueArrayField';
import {FieldError} from '@/components/@common/FieldError';
import {EditorRow} from './EditorRow';
import styles from './editorActionRequest.css';

const bodyTypeOptions = [
	{value: '', title: 'Original'},
	...requestBodyTypesList.map(type => ({
		value: type,
		title: type,
	})),
];

export const EditorActionRequest = React.memo(() => (
	<div className={styles.root}>
		<EditorRow title='Replace endpoint:'>
			<div className={styles.endpointBlock}>
				<TextField
					className={styles.endpointField}
					name='actions.mutate.request.endpoint'
					placeholder='%protocol%//%hostname%:%port%%path%%query%'
				/>
				<FieldError name='actions.mutate.request.endpoint' />
				{/*TODO Add info block*/}
			</div>
		</EditorRow>
		<EditorRow title='Replace method:'>
			<DropdownPicker
				className={styles.methodField}
				name='actions.mutate.request.method'
				placeholder='Method'
				options={requestMethodsList}
			/>
		</EditorRow>
		<EditorRow title='Headers:'>
			<KeyValueArrayField
				name='actions.mutate.request.headers'
				keyNameSuffix='name'
				valueNameSuffix='value'
				keyPlaceholder='Header name'
				valuePlaceholder='Header value (leave empty for delete)'
			/>
		</EditorRow>
		<EditorRow title='Body:'>
			<RadioTabs radioName='actions.mutate.request.body.type' tabs={bodyTypeOptions}>
				{(tabName: string) => {
					switch (tabName) {
						case RequestBodyType.Text:
							return (
								<TextareaField
									className={styles.bodyTextField}
									name={'actions.mutate.request.body.textValue'}
								/>
							);

						case RequestBodyType.UrlEncodedForm:
						case RequestBodyType.MultipartFromData:
							return (
								<KeyValueArrayField
									name='actions.mutate.request.body.formValue'
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
		</EditorRow>
	</div>
));
