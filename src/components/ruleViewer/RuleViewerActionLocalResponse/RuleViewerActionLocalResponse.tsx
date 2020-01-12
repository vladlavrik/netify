import React, {memo} from 'react';
import {LocalResponseAction} from '@/interfaces/rule';
import {RuleViewerRow} from '../RuleViewerRow';
import {RuleViewerDataTable} from '../RuleViewerDataTable';
import {RuleViewerBodyData} from '../RuleViewerBodyData';
import styles from './RuleViewerActionLocalResponse.css';

interface RuleViewerActionLocalResponseProps {
	action: LocalResponseAction;
}

export const RuleViewerActionLocalResponse = memo<RuleViewerActionLocalResponseProps>(
	function RuleViewerActionLocalResponse(props) {
		const {statusCode, headers, body} = props.action;

		return (
			<table className={styles.root}>
				<colgroup>
					<col className={styles.titleColumn} />
					<col />
				</colgroup>
				<tbody>
					<RuleViewerRow title='Status code:'>{statusCode}</RuleViewerRow>

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
	},
);
