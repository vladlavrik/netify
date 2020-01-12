import React, {memo} from 'react';
import {FailureAction} from '@/interfaces/rule';
import {responseErrorReasonsHumanTitles} from '@/constants/ResponseErrorReason';
import {RuleViewerRow} from '../RuleViewerRow';
import styles from './RuleViewerActionFailure.css';

interface RuleViewerActionFailureProps {
	action: FailureAction;
}

export const RuleViewerActionFailure = memo<RuleViewerActionFailureProps>(function RuleViewerActionFailure(props) {
	const {reason} = props.action;

	return (
		<table className={styles.root}>
			<tbody>
				<RuleViewerRow title='Error reason:'>{responseErrorReasonsHumanTitles[reason]}</RuleViewerRow>
			</tbody>
		</table>
	);
});
