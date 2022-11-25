import React from 'react';
import {observer} from 'mobx-react-lite';
import {LocalResponseRuleAction} from '@/interfaces/rule';
import {RuleViewerBodyData} from '../RuleViewerBodyData';
import {RuleViewerDataTable} from '../RuleViewerDataTable';
import {RuleViewerRow} from '../RuleViewerRow';
import styles from './ruleViewerActionLocalResponse.css';

interface RuleViewerActionLocalResponseProps {
	action: LocalResponseRuleAction;
}

export const RuleViewerActionLocalResponse = observer<RuleViewerActionLocalResponseProps>((props) => {
	const {delay, statusCode, headers, body} = props.action;

	return (
		<table className={styles.root}>
			<colgroup>
				<col className={styles.titleColumn} />
				<col />
			</colgroup>
			<tbody>
				<RuleViewerRow title='Status code:'>{statusCode}</RuleViewerRow>

				{delay && <RuleViewerRow title='Delay:'>{delay} ms</RuleViewerRow>}

				{headers.length > 0 && (
					<RuleViewerRow title='Headers:'>
						<RuleViewerDataTable values={headers.map(({name, value}) => [name, value])} />
					</RuleViewerRow>
				)}

				<RuleViewerRow title='Body:'>
					<RuleViewerBodyData body={body} />
				</RuleViewerRow>
			</tbody>
		</table>
	);
});

RuleViewerActionLocalResponse.displayName = 'RuleViewerActionLocalResponse';
