import React from 'react';
import {observer} from 'mobx-react-lite';
import {responseErrorReasonsHumanTitles} from '@/constants/ResponseErrorReason';
import {FailureRuleAction} from '@/interfaces/rule';
import {RuleViewerRow} from '../RuleViewerRow';
import styles from './ruleViewerActionFailure.css';

interface RuleViewerActionFailureProps {
	action: FailureRuleAction;
}

export const RuleViewerActionFailure = observer<RuleViewerActionFailureProps>((props) => {
	const {reason} = props.action;

	return (
		<table className={styles.root}>
			<tbody>
				<RuleViewerRow title={chrome.i18n.getMessage('errorReason')}>
					{responseErrorReasonsHumanTitles[reason]}
				</RuleViewerRow>
			</tbody>
		</table>
	);
});

RuleViewerActionFailure.displayName = 'RuleViewerActionFailure';
