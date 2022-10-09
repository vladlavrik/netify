import React from 'react';
import {observer} from 'mobx-react-lite';
import {MutationRuleAction} from '@/interfaces/rule';
import {RuleViewerBodyData} from '../RuleViewerBodyData';
import {RuleViewerDataTable} from '../RuleViewerDataTable';
import {RuleViewerRow} from '../RuleViewerRow';
import RequestIcon from './icons/request.svg';
import ResponseIcon from './icons/response.svg';
import styles from './ruleViewerActionMutation.css';

interface RuleViewerActionMutationProps {
	action: MutationRuleAction;
}

export const RuleViewerActionMutation = observer<RuleViewerActionMutationProps>((props) => {
	const {request, response} = props.action;

	const shownRows = {
		request: {
			endpoint: !!request.endpoint,
			method: !!request.method,
			setHeaders: request.setHeaders.length > 0,
			dropHeaders: request.dropHeaders.length > 0,
			body: !!request.body,
		},
		response: {
			delay: !!response.delay,
			statusCode: !!response.statusCode,
			setHeaders: response.setHeaders.length > 0,
			dropHeaders: response.dropHeaders.length > 0,
			body: response.body,
		},
	};

	const shownSections = {
		request:
			shownRows.request.endpoint ||
			shownRows.request.method ||
			shownRows.request.setHeaders ||
			shownRows.request.dropHeaders ||
			shownRows.request.body,
		response:
			shownRows.response.delay ||
			shownRows.response.statusCode ||
			shownRows.response.statusCode ||
			shownRows.response.setHeaders ||
			shownRows.response.dropHeaders ||
			shownRows.response.body,
	};

	if (!shownSections.request && !shownSections.response) {
		return <p className={styles.placeholder}>No changes</p>;
	}

	return (
		<table className={styles.table}>
			<colgroup>
				<col className={styles.titleColumn} />
				<col />
			</colgroup>
			<tbody>
				{shownSections.request && (
					<>
						<tr>
							<td className={styles.sectionTitle} colSpan={2}>
								<RequestIcon className={styles.sectionIcon} />
								Request
							</td>
						</tr>
						{shownRows.request.endpoint && (
							<RuleViewerRow title='Endpoint(url):'>{request.endpoint}</RuleViewerRow>
						)}
						{shownRows.request.method && (
							<RuleViewerRow title='Method:'>
								<strong>{request.method}</strong>
							</RuleViewerRow>
						)}
						{shownRows.request.setHeaders && (
							<RuleViewerRow title='Set headers:'>
								<RuleViewerDataTable
									values={request.setHeaders.map(({name, value}) => [name, value])}
								/>
							</RuleViewerRow>
						)}
						{shownRows.request.dropHeaders && (
							<RuleViewerRow title='Drop headers:'>{request.dropHeaders.join(', ')}</RuleViewerRow>
						)}
						{shownRows.request.body && (
							<RuleViewerRow title='Body:'>
								<RuleViewerBodyData body={request.body!} />
							</RuleViewerRow>
						)}
					</>
				)}
				{shownSections.response && (
					<>
						<tr>
							<td className={styles.sectionTitle} colSpan={2}>
								<ResponseIcon className={styles.sectionIcon} />
								Response
							</td>
						</tr>
						{shownRows.response.delay && <RuleViewerRow title='Delay:'>{response.delay} ms</RuleViewerRow>}
						{shownRows.response.statusCode && (
							<RuleViewerRow title='Status code:'>{response.statusCode}</RuleViewerRow>
						)}
						{shownRows.response.setHeaders && (
							<RuleViewerRow title='Set headers:'>
								<RuleViewerDataTable
									values={response.setHeaders.map(({name, value}) => [name, value])}
								/>
							</RuleViewerRow>
						)}
						{shownRows.response.dropHeaders && (
							<RuleViewerRow title='Drop headers:'>
								{response.dropHeaders.map((name, index) => (
									<p key={name + index.toString()}>{name}</p>
								))}
							</RuleViewerRow>
						)}
						{shownRows.response.body && (
							<RuleViewerRow title='Body:'>
								<RuleViewerBodyData body={response.body!} />
							</RuleViewerRow>
						)}
					</>
				)}
			</tbody>
		</table>
	);
});

RuleViewerActionMutation.displayName = 'RuleViewerActionMutation';
