import React, {memo, ReactNode} from 'react';
import {Button} from '@/components/@common/buttons/Button';
import {PopUp} from '@/components/@common/popups/PopUp';
import styles from './popUpAlert.css';

interface PopUpAlertProps {
	onClose(): void;
	children: ReactNode;
}

export const PopUpAlert = memo<PopUpAlertProps>(({onClose, children}) => (
	<PopUp className={styles.root}>
		<div className={styles.content}>{children}</div>
		<Button onClick={onClose}>Close</Button>
	</PopUp>
));

PopUpAlert.displayName = 'PopUpAlert';
