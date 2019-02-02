import * as React from 'react';
import {ResponseBodyType, responseBodyTypesList} from '@/constants/ResponseBodyType';
import {TextField} from '@/components/@common/TextField';
import {RadioButton} from '@/components/@common/RadioButton';
import {KeyValueArrayField} from '@/components/@common/KeyValueArrayField';
import {RadioTabs} from '@/components/@common/RadioTabs';
import {TextareaField} from '@/components/@common/TextaredField';
import {FileField} from '@/components/@common/FileField';
import {EditorRow} from './EditorRow';
import {EditorError} from './EditorError';
import styles from './editorActionResponse.css';

export class EditorActionResponse extends React.PureComponent {
	render() {
		return (
			<div className={styles.root}>
				<EditorRow title='Response mode:'>
					<div className={styles.modeFieldset}>
						<RadioButton
							className={styles.modeField}
							name='actions.mutateResponse.responseLocally'
							value='0'>
							After server response
						</RadioButton>
						<RadioButton
							className={styles.modeField}
							name='actions.mutateResponse.responseLocally'
							value='1'>
							Response locally
						</RadioButton>
					</div>
				</EditorRow>
				<EditorRow title='Status code:'>
					<div>
						<TextField
							className={styles.statusCode}
							name='actions.mutateResponse.statusCode'
							maxlength={3}
							placeholder='Default - from server or 200'
						/>
						<EditorError name='actions.mutateResponse.statusCode' />
					</div>
				</EditorRow>
				<EditorRow title='Headers:'>
					<KeyValueArrayField
						name='actions.mutateResponse.headers'
						keyNameSuffix='name'
						valueNameSuffix='value'
						keyPlaceholder='Header name'
						valuePlaceholder='Header value (leave empty for delete)'
					/>
				</EditorRow>
				<EditorRow title='Body:'>
					<RadioTabs
						radioName='actions.mutateResponse.bodyReplace.type'
						tabs={responseBodyTypesList.map(type => ({
							value: type,
							title: type,
						}))}
						render={this.renderBodyReplacer}
					/>
				</EditorRow>
			</div>
		);
	}

	renderBodyReplacer = (tabName: string) => {
		switch (tabName) {
			case ResponseBodyType.Text:
			case ResponseBodyType.Base64:
				return (
					<TextareaField
						className={styles.bodyTextField}
						name={'actions.mutateResponse.bodyReplace.textValue'}
					/>
				);

			case ResponseBodyType.File:
				return <FileField name='actions.mutateResponse.bodyReplace.fileValue' />;
		}

		return null;
	};
}
