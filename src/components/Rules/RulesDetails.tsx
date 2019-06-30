import * as React from 'react';
import {Rule} from '@/interfaces/Rule';
import {RequestBodyType} from '@/constants/RequestBodyType';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
import styles from './rulesDetails.css';

interface Props {
	data: Rule;
}

// TODO show interceptions
export class RulesDetails extends React.PureComponent<Props> {
	render() {
		const {filter} = this.props.data;
		const {mutateRequest, mutateResponse, cancelRequest} = this.props.data.actions;

		const existsRows = {
			filter: {
				url: !!filter.url.value,
				methods: filter.methods.length > 0,
				resourceTypes: filter.resourceTypes.length > 0,
			},
			mutateRequest: {
				endpointReplace: mutateRequest.endpointReplace.length > 0,
				methodReplace: !!mutateRequest.methodReplace,
				headersAdd: Object.keys(mutateRequest.headers.add).length > 0,
				headersRemove: mutateRequest.headers.remove.length > 0,
				bodyReplace: mutateRequest.bodyReplace.type !== RequestBodyType.Original,
			},
			mutateResponse: {
				statusCode: mutateResponse.statusCode,
				headersAdd: Object.keys(mutateResponse.headers.add).length > 0,
				headersRemove: mutateResponse.headers.remove.length > 0,
				bodyReplace: mutateResponse.bodyReplace.type !== ResponseBodyType.Original,
			},
			cancelRequest: cancelRequest.enabled,
		};

		const existsSections = {
			filter: existsRows.filter.url || existsRows.filter.methods || existsRows.filter.resourceTypes,

			// prettier-ignore
			mutateRequest: mutateRequest.enabled && (
				existsRows.mutateRequest.endpointReplace ||
				existsRows.mutateRequest.methodReplace ||
				existsRows.mutateRequest.headersAdd ||
				existsRows.mutateRequest.headersRemove ||
				existsRows.mutateRequest.bodyReplace
			),

			// prettier-ignore
			mutateResponse: mutateResponse.enabled && (
				existsRows.mutateResponse.statusCode ||
				existsRows.mutateResponse.headersAdd ||
				existsRows.mutateResponse.headersRemove||
				existsRows.mutateResponse.bodyReplace
			),

			cancelRequest: mutateResponse.enabled && existsRows.cancelRequest,
		};

		const hasActions =
			existsSections.mutateRequest || existsSections.mutateResponse || existsSections.cancelRequest;

		return (
			<div className={styles.root}>
				{existsSections.filter && (
					<table className={styles.dataSection}>
						<thead>
							<tr>
								<td className={styles.dataSectionTitle} colSpan={2}>
									Requests filter
								</td>
							</tr>
						</thead>
						<tbody>
							{existsRows.filter.url && (
								<tr>
									<td className={styles.dataTitle}>Url:</td>
									<td className={styles.dataValue}>{filter.url.value.toString()}</td>
								</tr>
							)}
							{existsRows.filter.methods && (
								<tr>
									<td className={styles.dataTitle}>Methods:</td>
									<td className={styles.dataValue}>{filter.methods.join(', ') || 'All methods'}</td>
								</tr>
							)}
							{existsRows.filter.resourceTypes && (
								<tr>
									<td className={styles.dataTitle}>Request types:</td>
									<td className={styles.dataValue}>
										{filter.resourceTypes.join(', ') || 'All types'}
									</td>
								</tr>
							)}
						</tbody>
					</table>
				)}

				{!hasActions && <p className={styles.dataPlaceholder}>No actions</p>}

				{existsSections.mutateRequest && (
					<table className={styles.dataSection}>
						<thead>
							<tr>
								<td className={styles.dataSectionTitle} colSpan={2}>
									Request mutations
								</td>
							</tr>
						</thead>
						<tbody>
							{existsRows.mutateRequest.endpointReplace && (
								<tr>
									<td className={styles.dataTitle}>Redirect to:</td>
									<td className={styles.dataValue}>{mutateRequest.endpointReplace}</td>
								</tr>
							)}
							{existsRows.mutateRequest.methodReplace && (
								<tr>
									<td className={styles.dataTitle}>Replacing method:</td>
									<td className={styles.dataValue}>{mutateRequest.methodReplace.toUpperCase()}</td>
								</tr>
							)}
							{existsRows.mutateRequest.headersAdd && (
								<tr>
									<td className={styles.dataTitle}>Adding headers:</td>
									<td className={styles.dataValue}>
										{Object.entries(mutateRequest.headers.add)
											.map(([name, value]) => name + ': ' + value)
											.join('<br>')}
									</td>
								</tr>
							)}
							{existsRows.mutateRequest.headersRemove && (
								<tr>
									<td className={styles.dataTitle}>Removing headers:</td>
									<td className={styles.dataValue}>{mutateRequest.headers.remove.join('<br>')}</td>
								</tr>
							)}
							{existsRows.mutateRequest.bodyReplace && (
								<tr>
									<td className={styles.dataTitle}>Replacing body:</td>
									{mutateRequest.bodyReplace.type === RequestBodyType.Text && (
										<td className={styles.dataValue}>
											{mutateRequest.bodyReplace.textValue.substr(0, 2400)}
										</td>
									)}
									{(mutateRequest.bodyReplace.type === RequestBodyType.UrlEncodedForm ||
										mutateRequest.bodyReplace.type === RequestBodyType.MultipartFromData) && (
										<td className={styles.dataValue}>
											Form:&nbsp;
											{mutateRequest.bodyReplace.type === RequestBodyType.UrlEncodedForm
												? 'application/x-www-form-urlencoded'
												: 'multipart/form-data?'}
											<br />
											{mutateRequest.bodyReplace.formValue.map(({key, value}, index) => (
												<div key={index}>
													{key}: {value}
												</div>
											))}
										</td>
									)}
								</tr>
							)}
						</tbody>
					</table>
				)}

				{existsSections.mutateResponse && (
					<table className={styles.dataSection}>
						<thead>
							<tr>
								<td className={styles.dataSectionTitle} colSpan={2}>
									Response mutations
								</td>
							</tr>
						</thead>
						<tbody>
							{existsRows.mutateResponse.statusCode && (
								<tr>
									<td className={styles.dataTitle}>Status code:</td>
									<td className={styles.dataValue}>{mutateResponse.statusCode!.toString()}</td>
								</tr>
							)}

							{existsRows.mutateResponse.headersAdd && (
								<tr>
									<td className={styles.dataTitle}>Adding headers:</td>
									<td className={styles.dataValue}>
										{Object.entries(mutateResponse.headers.add)
											.map(([name, value]) => name + ': ' + value)
											.join('<br>')}
									</td>
								</tr>
							)}

							{existsRows.mutateResponse.headersRemove && (
								<tr>
									<td className={styles.dataTitle}>Removing headers:</td>
									<td className={styles.dataValue}>{mutateResponse.headers.remove.join('<br>')}</td>
								</tr>
							)}

							{existsRows.mutateResponse.bodyReplace && (
								<tr>
									<td className={styles.dataTitle}>Replacing body:</td>
									{mutateResponse.bodyReplace.type === ResponseBodyType.Text && (
										<td className={styles.dataValue}>
											{mutateResponse.bodyReplace.textValue.substr(0, 2400)}
										</td>
									)}
									{mutateResponse.bodyReplace.type === ResponseBodyType.Base64 && (
										<td className={styles.dataValue}>
											Base 64: {mutateResponse.bodyReplace.textValue.substr(0, 128)}
										</td>
									)}
									{mutateResponse.bodyReplace.type === ResponseBodyType.File && (
										<td className={styles.dataValue}>
											File:&nbsp;
											{mutateResponse.bodyReplace.fileValue
												? mutateResponse.bodyReplace.fileValue.name +
												  ` (${mutateResponse.bodyReplace.fileValue.size} bytes)`
												: '(not specified)'}
										</td>
									)}
								</tr>
							)}
						</tbody>
					</table>
				)}

				{existsSections.cancelRequest && (
					<table className={styles.dataSection}>
						<thead>
							<tr>
								<td className={styles.dataSectionTitle} colSpan={2}>
									Cancel request
								</td>
							</tr>
						</thead>
						<tbody>
							{existsRows.cancelRequest && (
								<tr>
									<td className={styles.dataTitle}>Reason:</td>
									<td className={styles.dataValue}>{cancelRequest.reason.toString()}</td>
								</tr>
							)}
						</tbody>
					</table>
				)}
			</div>
		);
	}
}
