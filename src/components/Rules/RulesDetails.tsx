import * as React from 'react';
import {FailureAction, LocalResponseAction, MutationAction, Rule} from '@/interfaces/rule';
import {RequestBodyType} from '@/constants/RequestBodyType';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
import styles from './rulesDetails.css';
import {ActionsType} from '@/constants/ActionsType';

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
		const showUrl = !!url;
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
							<td className={styles.dataValue}>{url.toString()}</td>
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
							<td className={styles.dataValue}>{resourceTypes.join(', ') || 'All resources'}</td>
						</tr>
					)}
				</tbody>
			</table>
		);
	}

	renderAction() {
		const {action} = this.props.data;

		switch (action.type) {
			case ActionsType.Breakpoint:
				return this.renderBreakpointAction();
			case ActionsType.Mutation:
				return this.renderMutationAction();
			case ActionsType.LocalResponse:
				return this.renderLocalResponseAction();
			case ActionsType.Failure:
				return this.renderFailureAction();
		}
	}

	renderBreakpointAction() {
		// TODO show breakpoints
	}

	renderMutationAction() {
		const {request, response} = this.props.data.action as MutationAction;

		const shownFields = {
			// Request
			endpointReplace: !!request.endpoint,
			methodReplace: !!request.method,
			requestHeadersAdd: request.setHeaders.length > 0,
			requestHeadersRemove: request.dropHeaders.length > 0,
			requestBodyReplace: !!request.body,

			// Response
			statusCode: response.statusCode,
			responseHeadersAdd: response.setHeaders.length > 0,
			responseHeadersRemove: response.dropHeaders.length > 0,
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
			return <p className={styles.dataPlaceholder}>No actions</p>;
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
										{request.setHeaders.map(({name, value}) => `${name}: ${value}`).join('<br>')}
									</td>
								</tr>
							)}
							{shownFields.requestHeadersRemove && (
								<tr>
									<td className={styles.dataTitle}>Removing headers:</td>
									<td className={styles.dataValue}>{request.dropHeaders.join('<br>')}</td>
								</tr>
							)}
							{shownFields.requestBodyReplace && (
								<tr>
									<td className={styles.dataTitle}>Replacing body:</td>
									{request.body && request.body.type === RequestBodyType.Text && (
										<td className={styles.dataValue}>{request.body.value.substr(0, 2400)}</td>
									)}
									{request.body &&
										(request.body.type === RequestBodyType.UrlEncodedForm ||
											request.body.type === RequestBodyType.MultipartFromData) && (
											<td className={styles.dataValue}>
												Form:&nbsp;
												{request.body.type === RequestBodyType.UrlEncodedForm
													? 'application/x-www-form-urlencoded'
													: 'multipart/form-data?'}
												<br />
												{request.body.value.map(({key, value}, index) => (
													<div key={key + index.toString()}>
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
										{response.setHeaders.map(({name, value}) => `${name}: ${value}`).join('<br>')}
									</td>
								</tr>
							)}

							{shownFields.responseHeadersRemove && (
								<tr>
									<td className={styles.dataTitle}>Removing headers:</td>
									<td className={styles.dataValue}>{response.dropHeaders.join('<br>')}</td>
								</tr>
							)}

							{shownFields.responseBodyReplace && (
								<tr>
									<td className={styles.dataTitle}>Replacing body:</td>
									{response.body && response.body.type === ResponseBodyType.Text && (
										<td className={styles.dataValue}>{response.body.value.substr(0, 2400)}</td>
									)}
									{response.body && response.body.type === ResponseBodyType.Base64 && (
										<td className={styles.dataValue}>
											Base 64: {response.body.value.substr(0, 128)}
										</td>
									)}
									{response.body && response.body.type === ResponseBodyType.File && (
										<td className={styles.dataValue}>
											File:&nbsp;
											{response.body.value
												? `${response.body.value.name} (${response.body.value.size} bytes)`
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
								.map(([name, value]) => `${name}: ${value}`)
								.join('<br>')}
						</td>
					</tr>

					<tr>
						<td className={styles.dataTitle}>Body:</td>
						{body.type === ResponseBodyType.Text && (
							<td className={styles.dataValue}>{body.value.substr(0, 2400)}</td>
						)}
						{body.type === ResponseBodyType.Base64 && (
							<td className={styles.dataValue}>Base 64: {body.value.substr(0, 128)}</td>
						)}
						{body.type === ResponseBodyType.File && (
							<td className={styles.dataValue}>
								File:&nbsp;
								{body.value ? `${body.value.name} (${body.value.size} bytes)` : '(not specified)'}
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
