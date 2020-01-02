import React, {memo} from 'react';
import classNames from 'classnames';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {FieldRow} from '@/components/forms/common/FieldRow';
import {RequestMethodField} from '@/components/forms/common/RequestMethodField';
import {SetHeadersField} from '@/components/forms/common/SetHeadersField';
import {DropHeadersField} from '@/components/forms/common/DropHeadersField';
import {StatusCodeField} from '@/components/forms/common/StatusCodeField';
import {RequestBodyField} from '@/components/forms/common/RequestBodyField';
import {ResponseBodyField} from '@/components/forms/common/ResponseBodyField';
import {RuleEndpointField} from '../RuleEndpointField';
import styles from './ruleActionMutation.css';

export const RuleActionMutation = memo(() => {
	const namePrefix = `actionConfigs.${RuleActionsType.Mutation}`;

	return (
		<div>
			<FieldRow title={<strong>Stage</strong>}>
				<div className={classNames(styles.stageIcon, styles.request)} />
				<span className={styles.stageName}>Request</span>
			</FieldRow>

			<RuleEndpointField name={`${namePrefix}.request.endpoint`} />
			<RequestMethodField name={`${namePrefix}.request.method`} />
			<SetHeadersField name={`${namePrefix}.request.setHeaders`} />
			<DropHeadersField name={`${namePrefix}.request.dropHeaders`} />
			<RequestBodyField name={`${namePrefix}.request.body`} allowOrigin />

			<div className={styles.separator} />

			<FieldRow title={<strong>Stage</strong>}>
				<div className={classNames(styles.stageIcon, styles.response)} />
				<span className={styles.stageName}>Response</span>
			</FieldRow>
			<StatusCodeField name={`${namePrefix}.response.statusCode`} />
			<SetHeadersField name={`${namePrefix}.response.setHeaders`} />
			<DropHeadersField name={`${namePrefix}.response.dropHeaders`} />
			<ResponseBodyField name={`${namePrefix}.response.body`} allowOrigin />
		</div>
	);
});

RuleActionMutation.displayName = 'RuleActionMutation';
