import * as React from 'react';
import {Button} from '@/components/@common/buttons/Button';
import {PopUp} from '@/components/@common/popups/PopUp';
import styles from './popUpAlert.css';

interface Props {
	onClose(): void;
	children: React.ReactNode;
}

export const PopUpAlert = React.memo(({onClose, children}: Props) => (
	<PopUp className={styles.root}>
		<div className={styles.content}>{children}</div>
		<Button onClick={onClose}>Close</Button>
	</PopUp>
));
