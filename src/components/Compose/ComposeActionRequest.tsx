import * as React from 'react';
import {ComposeRow} from './ComposeRow';
import {TextField} from '@/components/@common/TextField';
import {DropdownPicker} from '@/components/@common/DropdownPicker';
import {RadioTabs} from '@/components/@common/RadioTabs';
import {TextareaField} from '@/components/@common/TextaredField';
import {KeyValueArrayField} from '@/components/@common/KeyValueArrayField';
import {RequestBodyType, requestBodyTypesList} from '@/constants/RequestBodyType';
import {requestMethodsList} from '@/constants/RequestMethod';
import styles from './composeActionRequest.css';

export class ComposeActionRequest extends React.PureComponent {
	render() {
		return (
			<div className={styles.root}>
				<ComposeRow title='Replace endpoint:'>
					<TextField
						className={styles.endpointField}
						name='actions.mutateRequest.endpointReplace'
						placeholder='%protocol%//%hostname%:%port%%path%%query%'
					/>
				</ComposeRow>
				<ComposeRow title='Replace method:'>
					<DropdownPicker
						className={styles.methodField}
						name='actions.mutateRequest.methodReplace'
						placeholder='Method'
						options={requestMethodsList}
					/>
				</ComposeRow>
				<ComposeRow title='Headers:'>
					<KeyValueArrayField
						name='actions.mutateRequest.headers'
						keyNameSuffix='name'
						valueNameSuffix='value'
						keyPlaceholder='Header name'
						valuePlaceholder='Header value (leave empty for delete)'
					/>
				</ComposeRow>
				<ComposeRow title='Body:'>
					<RadioTabs
						radioName='actions.mutateRequest.bodyReplace.type'
						tabs={requestBodyTypesList.map(type => ({
							value: type,
							title: type,
						}))}
						render={this.renderBodyReplacer}
					/>
				</ComposeRow>
			</div>
		);
	}

	renderBodyReplacer = (tabName: string) => {
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
		}

		return null;
	};
}
