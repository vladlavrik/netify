import React, {memo} from 'react';
import cn from 'classnames';
import {MutationAction} from '@/interfaces/rule';
import {RuleViewerRow} from '../RuleViewerRow';
import {RuleViewerDataTable} from '../RuleViewerDataTable';
import {RuleViewerBodyData} from '../RuleViewerBodyData';
import styles from './RuleViewerActionMutation.css';

interface RuleViewerActionMutationProps {
	action: MutationAction;
}

export const RuleViewerActionMutation = memo<RuleViewerActionMutationProps>(function RuleViewerActionMutation(props) {
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
			statusCode: !!response.statusCode,
			setHeaders: request.setHeaders.length > 0,
			dropHeaders: request.dropHeaders.length > 0,
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
							<td className={cn(styles.sectionTitle, styles.request)} colSpan={2}>
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
							<td className={cn(styles.sectionTitle, styles.response)} colSpan={2}>
								Response
							</td>
						</tr>
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
