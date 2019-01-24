import * as React from 'react';
import {ComposeRow} from './ComposeRow';
import {TextField} from '@/components/@common/TextField';
import {RadioTabs} from '@/components/@common/RadioTabs';
import {RequestBodyType, requestBodyTypesList} from '@/constants/RequestBodyType';
import {TextareaField} from '@/components/@common/TextaredField';
import {KeyValueArrayField} from '@/components/@common/KeyValueArrayField';
import styles from './composeActionRequest.css';

export class ComposeActionRequest extends React.PureComponent {
	render() {
		return (
			<div className={styles.root}>
				<ComposeRow title='Replace endpoint:'>
					<TextField
						className={styles.endpoint}
						name='actions.mutateRequest.endpointReplace'
						placeholder='%protocol%//%hostname%:%port%%path%%query%'
					/>
				</ComposeRow>
				<ComposeRow title='Headers:'>
					<KeyValueArrayField
						name='actions.mutateRequest.headers'
						keyNameSuffix='name'
						valueNameSuffix='value'
						keyPlaceholder='Header name'
						valuePlaceholder='Header value (leave empty for delete)'/>
				</ComposeRow>
				<ComposeRow title='Body:'>
					<RadioTabs
						radioName='actions.mutateRequest.replaceBody.type'
						tabs={requestBodyTypesList.map(type => ({
							value: type,
							title: type,
						}))}
						render={this.renderBodyReplacer}/>
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
						name={'actions.mutateRequest.replaceBody.textValue'} />
				);

			case RequestBodyType.UrlEncodedForm:
			case RequestBodyType.MultipartFromData:
				return (
					<KeyValueArrayField
						name='actions.mutateRequest.replaceBody.formValue'
						keyNameSuffix='key'
						valueNameSuffix='value'
						keyPlaceholder='Field key'
						valuePlaceholder='Field value'/>
				);
		}

		return null;
	}
}
