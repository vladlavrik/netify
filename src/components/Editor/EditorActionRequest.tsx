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

export const EditorActionRequest = React.memo(() => (
	<div className={styles.root}>
		<EditorRow title='Replace endpoint:'>
			<div className={styles.endpointBlock}>
				<TextField
					className={styles.endpointField}
					name='actions.mutateRequest.endpointReplace'
					placeholder='%protocol%//%hostname%:%port%%path%%query%'
				/>
				<FieldError name='actions.mutateRequest.endpointReplace'/>
				{/*TODO Add info block*/}
			</div>
		</EditorRow>
		<EditorRow title='Replace method:'>
			<DropdownPicker
				className={styles.methodField}
				name='actions.mutateRequest.methodReplace'
				placeholder='Method'
				options={requestMethodsList}
			/>
		</EditorRow>
		<EditorRow title='Headers:'>
			<KeyValueArrayField
				name='actions.mutateRequest.headers'
				keyNameSuffix='name'
				valueNameSuffix='value'
				keyPlaceholder='Header name'
				valuePlaceholder='Header value (leave empty for delete)'
			/>
		</EditorRow>
		<EditorRow title='Body:'>
			<RadioTabs
				radioName='actions.mutateRequest.bodyReplace.type'
				tabs={requestBodyTypesList.map(type => ({
					value: type,
					title: type,
				}))}>
				{(tabName: string) => {
					switch (tabName) {
						case RequestBodyType.Text:
							return (
								<TextareaField
									className={styles.bodyTextField}
									name={'actions.mutateRequest.bodyReplace.textValue'}
								/>
							);

						case RequestBodyType.UrlEncodedForm:
						case RequestBodyType.MultipartFromData:
							return (
								<KeyValueArrayField
									name='actions.mutateRequest.bodyReplace.formValue'
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
