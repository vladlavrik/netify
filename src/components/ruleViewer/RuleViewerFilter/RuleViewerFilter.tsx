import React from 'react';
import {observer} from 'mobx-react-lite';
import {Rule} from '@/interfaces/rule';
import {RuleViewerRow} from '../RuleViewerRow';
import styles from './ruleViewerFilter.css';

interface RuleViewerRowProps {
	filter: Rule['filter'];
}

export const RuleViewerFilter = observer<RuleViewerRowProps>((props) => {
	const {url, resourceTypes, methods} = props.filter;

	return (
		<table className={styles.root}>
			<tbody>
				{!!url && <RuleViewerRow title={chrome.i18n.getMessage('url')}>{url}</RuleViewerRow>}
				{resourceTypes.length !== 0 && (
					<RuleViewerRow title={chrome.i18n.getMessage('resourceType')}>
						{resourceTypes.join(', ')}
					</RuleViewerRow>
				)}
				{methods.length !== 0 && (
					<RuleViewerRow title={chrome.i18n.getMessage('requestMethod')}>{methods.join(', ')}</RuleViewerRow>
				)}
			</tbody>
		</table>
	);
});

RuleViewerFilter.displayName = 'RuleViewerFilter';
