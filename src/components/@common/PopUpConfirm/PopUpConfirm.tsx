import * as React from 'react';
import {Button} from '@/components/@common/Button';
import {PopUp} from '@/components/@common/PopUp';
import styles from './popUpConfirm.css';

interface Props {
	onConfirm(): void;
	onCancel(): void;
}

export class PopUpConfirm extends React.PureComponent<Props> {
	render() {
		const {children, onConfirm, onCancel} = this.props;
		return (
			<PopUp className={styles.root}>
				<div className={styles.content}>{children}</div>
				<div className={styles.buttons}>
					<Button className={styles.button} onClick={onConfirm}>
						Confirm
					</Button>
					<Button className={styles.button} styleType='light' onClick={onCancel}>
						Cancel
					</Button>
				</div>
			</PopUp>
		);
	}
}
