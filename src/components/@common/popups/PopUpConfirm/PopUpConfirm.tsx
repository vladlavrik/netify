import * as React from 'react';
import {Button} from '@/components/@common/buttons/Button';
import {PopUp} from '@/components/@common/popups/PopUp';
import styles from './popUpConfirm.css';

interface Props {
	onConfirm(): void;
	onCancel(): void;
	children: React.ReactNode;
}

export const PopUpConfirm = React.memo(({onConfirm, onCancel, children}: Props) => (
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
));
