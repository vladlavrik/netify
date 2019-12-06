import * as React from 'react';
import {Rule, FailureAction, LocalResponseAction, MutationAction} from '@/interfaces/rule';
import {RequestBodyType} from '@/constants/RequestBodyType';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
import styles from './rulesDetails.css';

interface Props {
	data: Rule;
}

export class RulesDetails extends React.PureComponent<Props> {
	render() {
		return (
			<div className={styles.root}>
				{this.renderFilter()}
				{this.renderAction()}
			</div>
		);
	}

	renderFilter() {
		const {url, methods, resourceTypes} = this.props.data.filter;
		const showUrl = !!url.value;
		const showMethod = methods.length > 0;
		const showResourceTypes = resourceTypes.length > 0;

		const showSection = showUrl || showMethod || showResourceTypes;

		if (showSection) {
			return null;
		}

		return (
			<table className={styles.dataSection}>
				<thead>
					<tr>
						<td className={styles.dataSectionTitle} colSpan={2}>
							Requests filter
						</td>
					</tr>
				</thead>
				<tbody>
					{showUrl && (
						<tr>
							<td className={styles.dataTitle}>Url:</td>
							<td className={styles.dataValue}>{url.value.toString()}</td>
						</tr>
					)}
					{showMethod && (
						<tr>
							<td className={styles.dataTitle}>Methods:</td>
							<td className={styles.dataValue}>{methods.join(', ') || 'All methods'}</td>
						</tr>
					)}
					{showResourceTypes && (
						<tr>
							<td className={styles.dataTitle}>Request types:</td>
							<td className={styles.dataValue}>{resourceTypes.join(', ') || 'All types'}</td>
						</tr>
					)}
				</tbody>
			</table>
		);
	}

	renderAction() {
		const {action} = this.props.data;
		switch (action.type) {
			case 'breakpoint':
				return this.renderBreakpointAction();
			case 'mutation':
				return this.renderMutationAction();
			case 'localResponse':
				return this.renderLocalResponseAction();
			case 'failure':
				return this.renderFailureAction();
		}
	}
	renderBreakpointAction() {
		// TODO show breakpoints
	}

	renderMutationAction() {
		const {request, response} = this.props.data.action as MutationAction;

		const shownFields = {
			// request
			endpointReplace: !!request.endpoint,
			methodReplace: !!request.method,
			requestHeadersAdd: Object.keys(request.headers.add).length > 0,
			requestHeadersRemove: request.headers.remove.length > 0,
			requestBodyReplace: !!request.body,

			// response
			statusCode: response.statusCode,
			responseHeadersAdd: Object.keys(response.headers.add).length > 0,
			responseHeadersRemove: response.headers.remove.length > 0,
			responseBodyReplace: !!response.body,
		};

		const shownRequestSection =
			shownFields.endpointReplace ||
			shownFields.methodReplace ||
			shownFields.requestHeadersAdd ||
			shownFields.requestHeadersRemove ||
			shownFields.requestBodyReplace;

		const shownResponseSection =
			shownFields.statusCode ||
			shownFields.responseHeadersAdd ||
			shownFields.responseHeadersRemove ||
			shownFields.responseBodyReplace;

		if (!shownRequestSection && !shownResponseSection) {
			return  (
				<p className={styles.dataPlaceholder}>No actions</p>
			);
		}

		return (
			<>
				{shownRequestSection && (
					<table className={styles.dataSection}>
						<thead>
							<tr>
								<td className={styles.dataSectionTitle} colSpan={2}>
									Request mutations
								</td>
							</tr>
						</thead>
						<tbody>
							{shownFields.endpointReplace && (
								<tr>
									<td className={styles.dataTitle}>Redirect to:</td>
									<td className={styles.dataValue}>{request.endpoint}</td>
								</tr>
							)}
							{shownFields.methodReplace && (
								<tr>
									<td className={styles.dataTitle}>Replacing method:</td>
									<td className={styles.dataValue}>{request.method!.toUpperCase()}</td>
								</tr>
							)}
							{shownFields.requestHeadersAdd && (
								<tr>
									<td className={styles.dataTitle}>Adding headers:</td>
									<td className={styles.dataValue}>
										{Object.entries(request.headers.add)
											.map(([name, value]) => name + ': ' + value)
											.join('<br>')}
									</td>
								</tr>
							)}
							{shownFields.requestHeadersRemove && (
								<tr>
									<td className={styles.dataTitle}>Removing headers:</td>
									<td className={styles.dataValue}>{request.headers.remove.join('<br>')}</td>
								</tr>
							)}
							{shownFields.requestBodyReplace && (
								<tr>
									<td className={styles.dataTitle}>Replacing body:</td>
									{request.body!.type === RequestBodyType.Text && (
										<td className={styles.dataValue}>{request.body!.textValue.substr(0, 2400)}</td>
									)}
									{(request.body!.type === RequestBodyType.UrlEncodedForm ||
										request.body!.type === RequestBodyType.MultipartFromData) && (
										<td className={styles.dataValue}>
											Form:&nbsp;
											{request.body!.type === RequestBodyType.UrlEncodedForm
												? 'application/x-www-form-urlencoded'
												: 'multipart/form-data?'}
											<br />
											{request.body!.formValue.map(({key, value}, index) => (
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

				{shownResponseSection && (
					<table className={styles.dataSection}>
						<thead>
							<tr>
								<td className={styles.dataSectionTitle} colSpan={2}>
									Response mutations
								</td>
							</tr>
						</thead>
						<tbody>
							{shownFields.statusCode && (
								<tr>
									<td className={styles.dataTitle}>Status code:</td>
									<td className={styles.dataValue}>{response.statusCode!.toString()}</td>
								</tr>
							)}

							{shownFields.responseHeadersAdd && (
								<tr>
									<td className={styles.dataTitle}>Adding headers:</td>
									<td className={styles.dataValue}>
										{Object.entries(response.headers.add)
											.map(([name, value]) => name + ': ' + value)
											.join('<br>')}
									</td>
								</tr>
							)}

							{shownFields.responseHeadersRemove && (
								<tr>
									<td className={styles.dataTitle}>Removing headers:</td>
									<td className={styles.dataValue}>{response.headers.remove.join('<br>')}</td>
								</tr>
							)}

							{shownFields.requestBodyReplace && (
								<tr>
									<td className={styles.dataTitle}>Replacing body:</td>
									{response.body!.type === ResponseBodyType.Text && (
										<td className={styles.dataValue}>{response.body!.textValue.substr(0, 2400)}</td>
									)}
									{response.body!.type === ResponseBodyType.Base64 && (
										<td className={styles.dataValue}>
											Base 64: {response.body!.textValue.substr(0, 128)}
										</td>
									)}
									{response.body!.type === ResponseBodyType.File && (
										<td className={styles.dataValue}>
											File:&nbsp;
											{response.body!.fileValue
												? response.body!.fileValue.name +
												  ` (${response.body!.fileValue.size} bytes)`
												: '(not specified)'}
										</td>
									)}
								</tr>
							)}
						</tbody>
					</table>
				)}
			</>
		);
	}

	renderLocalResponseAction() {
		// TODO show body in short value adn add expand button
		const {statusCode, headers, body} = this.props.data.action as LocalResponseAction;

		return (
			<table className={styles.dataSection}>
				<thead>
					<tr>
						<td className={styles.dataSectionTitle} colSpan={2}>
							Local response
						</td>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className={styles.dataTitle}>Status code:</td>
						<td className={styles.dataValue}>{statusCode!.toString()}</td>
					</tr>

					<tr>
						<td className={styles.dataTitle}>Headers:</td>
						<td className={styles.dataValue}>
							{Object.entries(headers)
								.map(([name, value]) => name + ': ' + value)
								.join('<br>')}
						</td>
					</tr>

					<tr>
						<td className={styles.dataTitle}>Body:</td>
						{body.type === ResponseBodyType.Text && (
							<td className={styles.dataValue}>{body.textValue.substr(0, 2400)}</td>
						)}
						{body.type === ResponseBodyType.Base64 && (
							<td className={styles.dataValue}>Base 64: {body.textValue.substr(0, 128)}</td>
						)}
						{body.type === ResponseBodyType.File && (
							<td className={styles.dataValue}>
								File:&nbsp;
								{body.fileValue
									? `${body.fileValue.name} (${body.fileValue.size} bytes)`
									: '(not specified)'}
							</td>
						)}
					</tr>
				</tbody>
			</table>
		);
	}

	renderFailureAction() {
		const {reason} = this.props.data.action as FailureAction;

		return (
			<table className={styles.dataSection}>
				<thead>
					<tr>
						<td className={styles.dataSectionTitle} colSpan={2}>
							Cancel request
						</td>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className={styles.dataTitle}>Reason:</td>
						<td className={styles.dataValue}>{reason.toString()}</td>
					</tr>
				</tbody>
			</table>
		);
	}
}
