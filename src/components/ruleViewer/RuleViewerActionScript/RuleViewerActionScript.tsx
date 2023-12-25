import React from 'react';
import {observer} from 'mobx-react-lite';
import {ScriptRuleAction} from '@/interfaces/rule';
import {CodePreview} from '@/components/@common/misc/CodePreview';
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
				{!!request && (
					<RuleViewerRow title='Request:'>
						<CodePreview value={request} />
					</RuleViewerRow>
				)}
				{!!response && (
					<RuleViewerRow title='Response:'>
						<CodePreview value={response} />
					</RuleViewerRow>
				)}
			</tbody>
		</table>
	);
});

RuleViewerActionScript.displayName = 'RuleViewerActionScript';
