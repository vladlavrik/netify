import * as React from 'react';
import {Rule} from '@/interfaces/Rule';
import {RequestBodyType} from '@/constants/RequestBodyType';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
import styles from './rulesDetails.css';

interface Props {
	data: Rule;
}

// TODO show breakpoints
export class RulesDetails extends React.PureComponent<Props> {
	render() {
		const {filter} = this.props.data;
		const {mutate, cancel} = this.props.data.actions;
		const {request: mutateRequest, response: mutateResponse} = mutate;

		const existsRows = {
			filter: {
				url: !!filter.url.value,
				methods: filter.methods.length > 0,
				resourceTypes: filter.resourceTypes.length > 0,
			},
			mutateRequest: {
				endpointReplace: mutateRequest.endpoint.length > 0,
				methodReplace: !!mutateRequest.method,
				headersAdd: Object.keys(mutateRequest.headers.add).length > 0,
				headersRemove: mutateRequest.headers.remove.length > 0,
				bodyReplace: !!mutateRequest.body.type,
			},
			mutateResponse: {
				statusCode: mutateResponse.statusCode,
				headersAdd: Object.keys(mutateResponse.headers.add).length > 0,
				headersRemove: mutateResponse.headers.remove.length > 0,
				bodyReplace: !!mutateResponse.body.type,
			},
			cancelRequest: cancel.enabled,
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
									<td className={styles.dataValue}>{mutateRequest.endpoint}</td>
								</tr>
							)}
							{existsRows.mutateRequest.methodReplace && (
								<tr>
									<td className={styles.dataTitle}>Replacing method:</td>
									<td className={styles.dataValue}>{mutateRequest.method!.toUpperCase()}</td>
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
									{mutateRequest.body.type === RequestBodyType.Text && (
										<td className={styles.dataValue}>
											{mutateRequest.body.textValue.substr(0, 2400)}
										</td>
									)}
									{(mutateRequest.body.type === RequestBodyType.UrlEncodedForm ||
										mutateRequest.body.type === RequestBodyType.MultipartFromData) && (
										<td className={styles.dataValue}>
											Form:&nbsp;
											{mutateRequest.body.type === RequestBodyType.UrlEncodedForm
												? 'application/x-www-form-urlencoded'
												: 'multipart/form-data?'}
											<br />
											{mutateRequest.body.formValue.map(({key, value}, index) => (
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
									{mutateResponse.body.type === ResponseBodyType.Text && (
										<td className={styles.dataValue}>
											{mutateResponse.body.textValue.substr(0, 2400)}
										</td>
									)}
									{mutateResponse.body.type === ResponseBodyType.Base64 && (
										<td className={styles.dataValue}>
											Base 64: {mutateResponse.body.textValue.substr(0, 128)}
										</td>
									)}
									{mutateResponse.body.type === ResponseBodyType.File && (
										<td className={styles.dataValue}>
											File:&nbsp;
											{mutateResponse.body.fileValue
												? mutateResponse.body.fileValue.name +
												  ` (${mutateResponse.body.fileValue.size} bytes)`
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
									<td className={styles.dataValue}>{cancel.reason.toString()}</td>
								</tr>
							)}
						</tbody>
					</table>
				)}
			</div>
		);
	}
}
