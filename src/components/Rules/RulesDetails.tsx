import * as React from 'react';
import classNames from 'classnames';
import {Rule} from '@/debugger/constants/Rule';
import styles from './rulesDetails.css';

interface Props {
	data: Rule
}

export class RulesDetails extends React.Component<Props> {

	render() {
		const {filter, mutateRequest, mutateResponse, responseError} = this.props.data;

		return (
			<div className={styles.root}>

				<div className={classNames(styles.separator, styles.separatorTop)}/>

				<table>
					<tbody>
						{filter.url.value && (
							<tr>
								<td className={styles.dataTitle}>Url:</td>
								<td className={styles.dataValue}>${filter.url.value.toString()}</td>
							</tr>
						)}
						{filter.methods.length > 0 && (
							<tr>
								<td className={styles.dataTitle}>Methods:</td>
								<td className={styles.dataValue}>${filter.methods.join(', ') || 'All methods'}</td>
							</tr>
						)}
						{filter.requestTypes.length > 0 && (
							<tr>
								<td className={styles.dataTitle}>Request types:</td>
								<td className={styles.dataValue}>${filter.requestTypes.join(', ') || 'All types'}</td>
							</tr>
						)}
					</tbody>
				</table>

				<div className={styles.separator}/>

				<table>
					<tbody>
						{mutateRequest.endpointReplace && (
							<tr>
								<td className={styles.dataTitle}>Request endpoint:</td>
								<td className={styles.dataValue}>${mutateRequest.endpointReplace}</td>
							</tr>
						)}

						{Object.keys(mutateRequest.headersToAdd).length > 0 && (
							<tr>
								<td className={styles.dataTitle}>Added request headers:</td>
								<td className={styles.dataValue}>
									{Object.entries(mutateRequest.headersToAdd).map(([key, value]) => (
										key + ': ' + value
									)).join('<br>')}
								</td>
							</tr>
						)}

						{mutateRequest.headersToRemove.length > 0 && (
							<tr>
								<td className={styles.dataTitle}>Removed request headers:</td>
								<td className={styles.dataValue}>
									${mutateRequest.headersToRemove.join('<br>')}
								</td>
							</tr>
						)}

						{mutateRequest.replaceBody.enabled && (
							<tr>
								<td className={styles.dataTitle}>Replaced request body</td>
								<td className={styles.dataValue}>${mutateRequest.replaceBody.value}</td>
							</tr>
						)}
					</tbody>
				</table>

				<div className={styles.separator}/>

				<table>
					<tbody>
						{mutateResponse.statusCode && (
							<tr>
								<td className={styles.dataTitle}>Response status</td>
								<td className={styles.dataValue}>${mutateResponse.statusCode.toString()}</td>
							</tr>
						)}

						{Object.keys(mutateResponse.headersToAdd).length > 0 && (
							<tr>
								<td className={styles.dataTitle}>Added response headers:</td>
								<td className={styles.dataValue}>
									${Object.entries(mutateResponse.headersToAdd).map(([key, value]) => (
									key + ': ' + value
								)).join('<br>')}
								</td>
							</tr>
						)}

						{mutateResponse.headersToRemove.length > 0 && (
							<tr>
								<td className={styles.dataTitle}>Removed response headers:</td>
								<td className={styles.dataValue}>
									${mutateResponse.headersToRemove.join('<br>')}
								</td>
							</tr>
						)}

						{mutateResponse.replaceBody.enabled && (
							<tr>
								<td className={styles.dataTitle}>Replaced response body</td>
								<td className={styles.dataValue}>${mutateRequest.replaceBody.value}</td>
							</tr>
						)}
					</tbody>
				</table>

				<div className={styles.separator}/>

				<table>
					<tbody>
						{responseError.enabled && (
							<tr>
								<td className={styles.dataTitle}>Response error:</td>
								<td className={styles.dataValue}>${responseError.reason.toString()}</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		);
	}

	followRule = () => {
		console.log('followRule');
	};
}
