import React, {memo, ReactNode} from 'react';
import {Button} from '@/components/@common/buttons/Button';
import {PopUp} from '@/components/@common/popups/PopUp';
import styles from './popUpConfirm.css';

interface PopUpConfirmProps {
	onConfirm(): void;
	onCancel(): void;
	children: ReactNode;
}

export const PopUpConfirm = memo<PopUpConfirmProps>(function PopUpConfirm({onConfirm, onCancel, children}) {
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
});
