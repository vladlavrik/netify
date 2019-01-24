import * as React from 'react';
import {ResponseBodyType, responseBodyTypesList} from '@/debugger/constants/ResponseBodyType';
import {TextField} from '@/components/@common/TextField';
import {RadioButton} from '@/components/@common/RadioButton';
import {KeyValueArrayField} from '@/components/@common/KeyValueArrayField';
import {RadioTabs} from '@/components/@common/RadioTabs';
import {TextareaField} from '@/components/@common/TextaredField';
import {ComposeRow} from './ComposeRow';
import {ComposeError} from './ComposeError';
import styles from './composeActionResponse.css';

export class ComposeActionResponse extends React.PureComponent {
	render() {
		return (
			<div className={styles.root}>
				<ComposeRow title='Response mode:'>
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
				</ComposeRow>
				<ComposeRow title='Status code:'>
					<div>
						<TextField
							className={styles.statusCode}
							name='actions.mutateResponse.statusCode'
							maxlength={3}
							placeholder='Default - from server or 200'
						/>
						<ComposeError name='actions.mutateResponse.statusCode'/>
					</div>
				</ComposeRow>
				<ComposeRow title='Headers:'>
					<KeyValueArrayField
						name='actions.mutateResponse.headers'
						keyNameSuffix='name'
						valueNameSuffix='value'
						keyPlaceholder='Header name'
						valuePlaceholder='Header value (leave empty for delete)'/>
				</ComposeRow>
				<ComposeRow title='Body:'>
					<RadioTabs
						radioName='actions.mutateResponse.replaceBody.type'
						tabs={responseBodyTypesList.map(type => ({
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
			case ResponseBodyType.Text:
			case ResponseBodyType.Base64:
				return (
					<TextareaField
						className={styles.bodyTextField}
						name={'actions.mutateResponse.replaceBody.textValue'} />
				);

			case ResponseBodyType.Blob:
				return (
					<b>TODO: implement file upload</b>
				);
		}

		return null;
	}
}
