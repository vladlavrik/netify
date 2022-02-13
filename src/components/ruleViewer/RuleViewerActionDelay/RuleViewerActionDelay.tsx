import React, {memo} from 'react';
import {DelayAction} from '@/interfaces/rule';
import {RuleViewerRow} from '../RuleViewerRow';
import styles from './RuleViewerActionDelay.css';

interface RuleViewerActionDelayProps {
	action: DelayAction;
}

export const RuleViewerActionDelay = memo<RuleViewerActionDelayProps>(function RuleViewerActionDelay(props) {
	return (
		<table className={styles.root}>
			<tbody>
				<RuleViewerRow title='Delay time:'>{props.action.timeout}ms</RuleViewerRow>
			</tbody>
		</table>
	);
});
