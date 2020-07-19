import React, {memo} from 'react';
import {Button} from '@/components/@common/buttons/Button';
import styles from './breakpointExecuteButton.css';

interface BreakpointExecuteButtonProps {
	onClick(): void;
}

export const BreakpointExecuteButton = memo<BreakpointExecuteButtonProps>(function BreakpointExecuteButton({onClick}) {
	return (
		<Button className={styles.root} withIcon onClick={onClick}>
			Abort
		</Button>
	);
});
