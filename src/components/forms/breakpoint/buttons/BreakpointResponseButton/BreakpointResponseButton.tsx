import React, {memo} from 'react';
import {Button} from '@/components/@common/buttons/Button';
import styles from './breakpointResponseButton.css';

interface BreakpointResponseButtonProps {
	onClick(): void;
}

export const BreakpointResponseButton = memo<BreakpointResponseButtonProps>(function BreakpointResponseButton(props) {
	const {onClick} = props;
	return (
		<Button className={styles.root} withIcon onClick={onClick}>
			Abort
		</Button>
	);
});
