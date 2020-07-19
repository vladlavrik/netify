import React, {memo} from 'react';
import {Button} from '@/components/@common/buttons/Button';
import styles from './breakpointAbortButton.css';

interface BreakpointAbortButtonProps {
	onClick(): void;
}

export const BreakpointAbortButton = memo<BreakpointAbortButtonProps>(function({onClick}) {
	return (
		<Button className={styles.root} withIcon onClick={onClick}>
			Abort
		</Button>
	);
});
