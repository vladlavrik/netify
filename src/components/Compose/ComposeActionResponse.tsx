import * as React from 'react';
import {ComposeRow} from './ComposeRow';
import {ComposeHeaders} from './ComposeHeaders';
import {ComposeBody} from './ComposeBody';
import {TextField} from '@/components/@common/TextField';
import styles from './composeActionResponse.css';
import {RadioButton} from '@/components/@common/RadioButton';

export class ComposeActionResponse extends React.Component {
	render() {
		return (
			<div className={styles.root}>
				<ComposeRow title='Response mode:'>
					<div className={styles.modeFieldset}>
						<RadioButton className={styles.modeField} name='mutateResponse.mode' value='server'>
							After server response
						</RadioButton>
						<RadioButton className={styles.modeField} name='mutateResponse.mode' value='locally'>
							Response locally
						</RadioButton>
					</div>
				</ComposeRow>
				<ComposeRow title='Status code:'>
					<TextField
						className={styles.statusCode}
						name='mutateResponse.statusCode'
						maxlength={3}
						placeholder='Default - from server or 200'
					/>
				</ComposeRow>
				<ComposeRow title='Headers:'>
					<ComposeHeaders name='mutateResponse.headers' />
				</ComposeRow>
				<ComposeRow title='Body:'>
					<ComposeBody name='mutateResponse.body' />
				</ComposeRow>
			</div>
		);
	}
}
