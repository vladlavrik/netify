import React, {memo} from 'react';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {FieldRow} from '@/components/forms/common/FieldRow';
import {RequestMethodField} from '@/components/forms/common/RequestMethodField';
import {SetHeadersField} from '@/components/forms/common/SetHeadersField';
import {DropHeadersField} from '@/components/forms/common/DropHeadersField';
import {StatusCodeField} from '@/components/forms/common/StatusCodeField';
import {RequestBodyField} from '@/components/forms/common/RequestBodyField';
import {ResponseBodyField} from '@/components/forms/common/ResponseBodyField';
import {RuleEndpointField} from '../RuleEndpointField';
import RequestIcon from './icons/request.svg';
import ResponseIcon from './icons/response.svg';
import styles from './ruleActionMutation.css';

export const RuleActionMutation = memo(function RuleActionMutation() {
	const namePrefix = `actionConfigs.${RuleActionsType.Mutation}`;

	return (
		<div>
			<FieldRow title={<strong>Stage</strong>}>
				<RequestIcon className={styles.stageIcon} />
				<span className={styles.stageName}>Request</span>
			</FieldRow>

			<RuleEndpointField name={`${namePrefix}.request.endpoint`} />
			<RequestMethodField name={`${namePrefix}.request.method`} />
			<SetHeadersField name={`${namePrefix}.request.setHeaders`} />
			<DropHeadersField name={`${namePrefix}.request.dropHeaders`} />
			<RequestBodyField name={`${namePrefix}.request.body`} allowOrigin />

			<div className={styles.separator} />

			<FieldRow title={<strong>Stage</strong>}>
				<ResponseIcon className={styles.stageIcon} />
				<span className={styles.stageName}>Response</span>
			</FieldRow>
			<StatusCodeField name={`${namePrefix}.response.statusCode`} />
			<SetHeadersField name={`${namePrefix}.response.setHeaders`} />
			<DropHeadersField name={`${namePrefix}.response.dropHeaders`} />
			<ResponseBodyField name={`${namePrefix}.response.body`} allowOrigin />
		</div>
	);
});
