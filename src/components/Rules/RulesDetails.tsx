import * as React from 'react';
import classNames from 'classnames';
import {Rule} from '@/debugger/interfaces/Rule';
import styles from './rulesDetails.css';

interface Props {
	data: Rule;
}

export class RulesDetails extends React.PureComponent<Props> {
	render() {
		const {filter} = this.props.data;
		const {mutateRequest, mutateResponse, cancelRequest} = this.props.data.actions;

		// TODO fix empty tables

		return (
			<div className={styles.root}>
				<div className={classNames(styles.separator, styles.separatorTop)} />

				<table>
					<tbody className={styles.dataSection}>
						{!!filter.url.value && (
							<tr>
								<td className={styles.dataTitle}>Url:</td>
								<td className={styles.dataValue}>{filter.url.value.toString()}</td>
							</tr>
						)}
						{filter.methods.length > 0 && (
							<tr>
								<td className={styles.dataTitle}>Methods:</td>
								<td className={styles.dataValue}>{filter.methods.join(', ') || 'All methods'}</td>
							</tr>
						)}
						{filter.resourceTypes.length > 0 && (
							<tr>
								<td className={styles.dataTitle}>Request types:</td>
								<td className={styles.dataValue}>{filter.resourceTypes.join(', ') || 'All types'}</td>
							</tr>
						)}
					</tbody>
				</table>

				<div className={styles.separator} />

				<table>
					<tbody className={styles.dataSection}>
						{mutateRequest.endpointReplace.length > 0 && (
							<tr>
								<td className={styles.dataTitle}>Request endpoint:</td>
								<td className={styles.dataValue}>{mutateRequest.endpointReplace}</td>
							</tr>
						)}
						{Object.keys(mutateRequest.headers.add).length > 0 && (
							<tr>
								<td className={styles.dataTitle}>Added request headers:</td>
								<td className={styles.dataValue}>
									{Object.entries(mutateRequest.headers.add)
										.map(([name, value]) => name + ': ' + value)
										.join('<br>')}
								</td>
							</tr>
						)}
						{mutateRequest.headers.remove.length > 0 && (
							<tr>
								<td className={styles.dataTitle}>Removed request headers:</td>
								<td className={styles.dataValue}>{mutateRequest.headers.remove.join('<br>')}</td>
							</tr>
						)}
						{mutateRequest.replaceBody.enabled && (
							<tr>
								<td className={styles.dataTitle}>Replaced request body:</td>
								<td className={styles.dataValue}>{mutateRequest.replaceBody.value}</td>
							</tr>
						)}
					</tbody>
				</table>

				<div className={styles.separator} />

				<table>
					<tbody className={styles.dataSection}>
						{mutateResponse.statusCode && (
							<tr>
								<td className={styles.dataTitle}>Response status:</td>
								<td className={styles.dataValue}>{mutateResponse.statusCode.toString()}</td>
							</tr>
						)}

						{Object.keys(mutateResponse.headers.add).length > 0 && (
							<tr>
								<td className={styles.dataTitle}>Added response headers:</td>
								<td className={styles.dataValue}>
									{Object.entries(mutateResponse.headers.add)
										.map(([name, value]) => name + ': ' + value)
										.join('<br>')}
								</td>
							</tr>
						)}

						{mutateResponse.headers.remove.length > 0 && (
							<tr>
								<td className={styles.dataTitle}>Removed response headers:</td>
								<td className={styles.dataValue}>{mutateResponse.headers.remove.join('<br>')}</td>
							</tr>
						)}

						{mutateResponse.replaceBody.enabled && (
							<tr>
								<td className={styles.dataTitle}>Replaced response body:</td>
								<td className={styles.dataValue}>{mutateRequest.replaceBody.value}</td>
							</tr>
						)}
					</tbody>
				</table>

				<div className={styles.separator} />

				<table>
					<tbody className={styles.dataSection}>
						{cancelRequest.enabled && (
							<tr>
								<td className={styles.dataTitle}>Cancel reason:</td>
								<td className={styles.dataValue}>{cancelRequest.reason.toString()}</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		);
	}
}
