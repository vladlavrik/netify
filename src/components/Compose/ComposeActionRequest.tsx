import * as React from 'react';
import {ComposeRow} from './ComposeRow';
import {ComposeHeaders} from './ComposeHeaders';
import {ComposeBody} from './ComposeBody';
import {TextField} from '@/components/@common/TextField';
import styles from './composeActionRequest.css';

export class ComposeActionRequest extends React.Component {
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
					<ComposeHeaders name='actions.mutateRequest.headers' />
				</ComposeRow>
				<ComposeRow title='Body:'>
					<ComposeBody name='actions.mutateRequest.body' />
				</ComposeRow>
			</div>
		);
	}
}
