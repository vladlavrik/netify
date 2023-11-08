import React from 'react';
import {observer} from 'mobx-react-lite';
import {BreakpointRuleAction} from '@/interfaces/rule';
import {RuleViewerRow} from '../RuleViewerRow';
import styles from './ruleViewerActionBreakpoint.css';

interface RuleViewerActionBreakpointProps {
	action: BreakpointRuleAction;
}

export const RuleViewerActionBreakpoint = observer<RuleViewerActionBreakpointProps>((props) => {
	const {request, response} = props.action;

	return (
		<table className={styles.root}>
			<tbody>
				<RuleViewerRow title={chrome.i18n.getMessage('stage2')}>
					{request && response && 'on request and response'}
					{request && !response && 'on request'}
					{!request && response && 'on response'}
				</RuleViewerRow>
			</tbody>
		</table>
	);
});

RuleViewerActionBreakpoint.displayName = 'RuleViewerActionBreakpoint';
