import React from 'react';
import {observer} from 'mobx-react-lite';
import {ScriptRuleAction} from '@/interfaces/rule';
import {RuleViewerRow} from '../RuleViewerRow';
import styles from './ruleViewerActionScript.css';

interface RuleViewerActionFailureProps {
	action: ScriptRuleAction;
}

export const RuleViewerActionScript = observer<RuleViewerActionFailureProps>((props) => {
	const {request, response} = props.action;

	return (
		<table className={styles.root}>
			<tbody>
				<RuleViewerRow title='Request:'>
					<code className={styles.code}>{request}</code>
				</RuleViewerRow>
				<RuleViewerRow title='Response:'>
					<code className={styles.code}>{response}</code>
				</RuleViewerRow>
			</tbody>
		</table>
	);
});

RuleViewerActionScript.displayName = 'RuleViewerActionScript';
