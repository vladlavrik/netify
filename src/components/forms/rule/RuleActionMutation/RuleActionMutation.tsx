import React, {memo} from 'react';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {RequestBodyField} from '@/components/@common/formsKit/RequestBodyField';
import {RequestMethodField} from '@/components/@common/formsKit/RequestMethodField';
import {ResponseBodyField} from '@/components/@common/formsKit/ResponseBodyField';
import {SetHeadersField} from '@/components/@common/formsKit/SetHeadersField';
import {StatusCodeField} from '@/components/@common/formsKit/StatusCodeField';
import {RuleDropHeadersField} from '@/components/forms/rule/RuleDropHeadersField';
import {RuleEndpointField} from '../RuleEndpointField';
import {RuleRow} from '../RuleRow';
import RequestIcon from './icons/request.svg';
import ResponseIcon from './icons/response.svg';
import styles from './ruleActionMutation.css';

export const RuleActionMutation = memo(() => {
	const namePrefix = `actionConfigs.${RuleActionsType.Mutation}`;

	return (
		<div>
			<RuleRow title={<strong>Stage</strong>}>
				<RequestIcon className={styles.stageIcon} />
				<span className={styles.stageName}>Request</span>
			</RuleRow>

			<RuleRow title='Endpoint:'>
				<RuleEndpointField name={`${namePrefix}.request.endpoint`} />
			</RuleRow>
			<RuleRow title='Method:'>
				<RequestMethodField name={`${namePrefix}.request.method`} allowEmpty />
			</RuleRow>
			<RuleRow title='Set headers:'>
				<SetHeadersField name={`${namePrefix}.request.setHeaders`} />
			</RuleRow>
			<RuleRow title='Drop headers:'>
				<RuleDropHeadersField name={`${namePrefix}.request.dropHeaders`} />
			</RuleRow>
			<RuleRow title='Body:'>
				<RequestBodyField name={`${namePrefix}.request.body`} allowOrigin />
			</RuleRow>
			<div className={styles.separator} />

			<RuleRow title={<strong>Stage</strong>}>
				<ResponseIcon className={styles.stageIcon} />
				<span className={styles.stageName}>Response</span>
			</RuleRow>
			<RuleRow title='Status code:'>
				<StatusCodeField name={`${namePrefix}.response.statusCode`} />
			</RuleRow>
			<RuleRow title='Set headers:'>
				<SetHeadersField name={`${namePrefix}.response.setHeaders`} />
			</RuleRow>
			<RuleRow title='Drop headers:'>
				<RuleDropHeadersField name={`${namePrefix}.response.dropHeaders`} />
			</RuleRow>
			<RuleRow title='Body:'>
				<ResponseBodyField
					name={`${namePrefix}.response.body`}
					allowOrigin
					fileFieldNote='Body replacing will also rewrites "Content-Type" header'
				/>
			</RuleRow>
		</div>
	);
});

RuleActionMutation.displayName = 'RuleActionMutation';
