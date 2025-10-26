import React, {FC, ReactNode} from 'react';
import {TextButton} from '@/components/@common/buttons/TextButton';
import {PopUp} from '@/components/@common/popups/PopUp';
import styles from './popUpAlert.css';

interface PopUpAlertProps {
	onClose(): void;
	children: ReactNode;
}

export const PopUpAlert: FC<PopUpAlertProps> = ({onClose, children}) => {
	return (
		<PopUp className={styles.root} onClose={onClose}>
			<div className={styles.content}>{children}</div>
			<TextButton className={styles.closeButton} styleType='raised' onClick={onClose}>
				Close
			</TextButton>
		</PopUp>
	);
};

PopUpAlert.displayName = 'PopUpAlert';
