import React, {FC, ReactNode} from 'react';
import {Button} from '@/components/@common/buttons/Button';
import {PopUp} from '@/components/@common/popups/PopUp';
import styles from './popUpAlert.css';

interface PopUpAlertProps {
	onClose(): void;
	children: ReactNode;
}

export const PopUpAlert: FC<PopUpAlertProps> = ({onClose, children}) => {
	return (
		<PopUp className={styles.root}>
			<div className={styles.content}>{children}</div>
			<Button onClick={onClose}>{chrome.i18n.getMessage('close')}</Button>
		</PopUp>
	);
};

PopUpAlert.displayName = 'PopUpAlert';
