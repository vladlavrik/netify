import React, {FC, ReactNode} from 'react';
import {useGlobalHotkey} from '@/hooks/useGlobalHotkey';
import {TextButton} from '@/components/@common/buttons/TextButton';
import {PopUp} from '@/components/@common/popups/PopUp';
import styles from './popUpConfirm.css';

interface PopUpConfirmProps {
	onConfirm(): void;
	onCancel(): void;
	children: ReactNode;
}

export const PopUpConfirm: FC<PopUpConfirmProps> = (props) => {
	const {onConfirm, onCancel, children} = props;

	useGlobalHotkey('Escape', onCancel);

	return (
		<PopUp className={styles.root} onClose={onCancel}>
			<div className={styles.content}>{children}</div>
			<div className={styles.buttons}>
				<TextButton className={styles.button} styleType='raised' onClick={onConfirm}>
					Confirm
				</TextButton>
				<TextButton className={styles.button} styleType='secondary' onClick={onCancel}>
					Cancel
				</TextButton>
			</div>
		</PopUp>
	);
};

PopUpConfirm.displayName = 'PopUpConfirm';
