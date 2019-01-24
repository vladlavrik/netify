import * as React from 'react';
import {Rule} from '@/debugger/interfaces/Rule';
import {RequestBodyType} from '@/debugger/constants/RequestBodyType';
import {ResponseBodyType} from '@/debugger/constants/ResponseBodyType';
import styles from './rulesDetails.css';

interface Props {
	data: Rule;
}

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
				headersAdd: Object.keys(mutateRequest.headers.add).length > 0,
				headersRemove: mutateRequest.headers.remove.length > 0,
				replaceBody: mutateRequest.replaceBody.type !== RequestBodyType.Original,
			},
			mutateResponse: {
				statusCode: mutateResponse.statusCode,
				headersAdd: Object.keys(mutateResponse.headers.add).length > 0,
				headersRemove: mutateResponse.headers.remove.length > 0,
				replaceBody: mutateResponse.replaceBody.type !== ResponseBodyType.Original,
			},
			cancelRequest: cancelRequest.enabled,
		};

		const existsSections = {
			filter: existsRows.filter.url ||
				existsRows.filter.methods ||
				existsRows.filter.resourceTypes,

			mutateRequest: mutateRequest.enabled && (
				existsRows.mutateRequest.endpointReplace ||
				existsRows.mutateRequest.headersAdd ||
				existsRows.mutateRequest.headersRemove ||
				existsRows.mutateRequest.replaceBody
			),

			mutateResponse: mutateResponse.enabled && (
				existsRows.mutateResponse.statusCode ||
				existsRows.mutateResponse.headersAdd ||
				existsRows.mutateResponse.headersRemove||
				existsRows.mutateResponse.replaceBody
			),

			cancelRequest: mutateResponse.enabled && existsRows.cancelRequest,
		};

		return (
			<div className={styles.root}>
				{existsSections.filter && (
					<table className={styles.dataSection}>
						<thead>
							<tr>
								<td className={styles.dataSectionTitle} colSpan={2}>Requests filter</td>
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
								<td className={styles.dataValue}>{filter.resourceTypes.join(', ') || 'All types'}</td>
							</tr>
						)}
						</tbody>
					</table>
				)}

				{existsSections.mutateRequest && (
					<table className={styles.dataSection}>
						<thead>
							<tr>
								<td className={styles.dataSectionTitle} colSpan={2}>Request mutations</td>
							</tr>
						</thead>
						<tbody>
						{existsRows.mutateRequest.endpointReplace && (
							<tr>
								<td className={styles.dataTitle}>Replacing endpoint:</td>
								<td className={styles.dataValue}>{mutateRequest.endpointReplace}</td>
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
						{existsRows.mutateRequest.replaceBody && (
							<tr>
								<td className={styles.dataTitle}>Replacing body:</td>
								{mutateRequest.replaceBody.type === RequestBodyType.Text && (
									<td className={styles.dataValue}>
										{mutateRequest.replaceBody.textValue.substr(0, 2400)}
									</td>
								)}
								{(
									mutateRequest.replaceBody.type === RequestBodyType.UrlEncodedForm ||
									mutateRequest.replaceBody.type === RequestBodyType.MultipartFromData
								) && (
									<td className={styles.dataValue}>
										Form:&nbsp;
										{mutateRequest.replaceBody.type === RequestBodyType.UrlEncodedForm
											? 'application/x-www-form-urlencoded'
											: 'multipart/form-data?'}
										<br/>
										{mutateRequest.replaceBody.formValue.map(({key, value}, index) => (
											<div key={index}>{key}: {value}</div>
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
								<td className={styles.dataSectionTitle} colSpan={2}>Response mutations</td>
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

						{existsRows.mutateResponse.replaceBody && (
							<tr>
								<td className={styles.dataTitle}>Replacing body:</td>
								{mutateResponse.replaceBody.type === ResponseBodyType.Text && (
									<td className={styles.dataValue}>
										{mutateResponse.replaceBody.textValue.substr(0, 2400)}
									</td>
								)}
								{mutateResponse.replaceBody.type === ResponseBodyType.Base64 && (
									<td className={styles.dataValue}>
										Base 64: {mutateResponse.replaceBody.textValue.substr(0, 128)}
									</td>
								)}
								{mutateResponse.replaceBody.type === ResponseBodyType.Blob && (
									<td className={styles.dataValue}>&lt;Blob value&gt;</td>
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
							<td className={styles.dataSectionTitle} colSpan={2}>Cancel request</td>
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
