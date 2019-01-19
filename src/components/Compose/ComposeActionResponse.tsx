import * as React from 'react';
import {ComposeRow} from './ComposeRow';
import {ComposeHeaders} from './ComposeHeaders';
import {ComposeBody} from './ComposeBody';
import {ComposeError} from './ComposeError';
import {TextField} from '@/components/@common/TextField';
import styles from './composeActionResponse.css';
import {RadioButton} from '@/components/@common/RadioButton';

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
					<ComposeHeaders name='actions.mutateResponse.headers' />
				</ComposeRow>
				<ComposeRow title='Body:'>
					<ComposeBody name='actions.mutateResponse.replaceBody' />
				</ComposeRow>
			</div>
		);
	}
}
