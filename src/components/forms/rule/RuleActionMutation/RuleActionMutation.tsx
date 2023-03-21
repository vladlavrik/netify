import React, {memo} from 'react';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {RequestBodyField} from '@/components/@common/formsKit/RequestBodyField';
import {RequestMethodField} from '@/components/@common/formsKit/RequestMethodField';
import {ResponseBodyField} from '@/components/@common/formsKit/ResponseBodyField';
import {SetHeadersField} from '@/components/@common/formsKit/SetHeadersField';
import {StatusCodeField} from '@/components/@common/formsKit/StatusCodeField';
import {RuleDropHeadersField} from '@/components/forms/rule/RuleDropHeadersField';
import {RuleDelayField} from '../RuleDelayField';
import {RuleEndpointField} from '../RuleEndpointField';
import {RuleRow} from '../RuleRow';
import RequestIcon from './icons/request.svg';
import ResponseIcon from './icons/response.svg';
import styles from './ruleActionMutation.css';

export const RuleActionMutation = memo(() => {
	const namePrefix = `actionConfigs.${RuleActionsType.Mutation}`;

	return (
		<div>
			<RuleRow strong title={chrome.i18n.getMessage('stage2')}>
				<RequestIcon className={styles.stageIcon} />
				<span className={styles.stageName}>Request</span>
			</RuleRow>

			<RuleRow title={chrome.i18n.getMessage('endpoint')}>
				<RuleEndpointField name={`${namePrefix}.request.endpoint`} />
			</RuleRow>
			<RuleRow title={chrome.i18n.getMessage('method')}>
				<RequestMethodField name={`${namePrefix}.request.method`} allowEmpty />
			</RuleRow>
			<RuleRow title={chrome.i18n.getMessage('setHeaders')}>
				<SetHeadersField name={`${namePrefix}.request.setHeaders`} />
			</RuleRow>
			<RuleRow title={chrome.i18n.getMessage('dropHeaders')}>
				<RuleDropHeadersField name={`${namePrefix}.request.dropHeaders`} />
			</RuleRow>
			<RuleRow title={chrome.i18n.getMessage('body')}>
				<RequestBodyField name={`${namePrefix}.request.body`} allowOrigin />
			</RuleRow>
			<div className={styles.separator} />

			<RuleRow strong title={chrome.i18n.getMessage('stage2')}>
				<ResponseIcon className={styles.stageIcon} />
				<span className={styles.stageName}>Response</span>
			</RuleRow>
			<RuleRow title={chrome.i18n.getMessage('delayMs')}>
				<RuleDelayField name={`${namePrefix}.response.delay`} />
			</RuleRow>
			<RuleRow title={chrome.i18n.getMessage('statusCode')}>
				<StatusCodeField name={`${namePrefix}.response.statusCode`} />
			</RuleRow>
			<RuleRow title={chrome.i18n.getMessage('setHeaders')}>
				<SetHeadersField name={`${namePrefix}.response.setHeaders`} />
			</RuleRow>
			<RuleRow title={chrome.i18n.getMessage('dropHeaders')}>
				<RuleDropHeadersField name={`${namePrefix}.response.dropHeaders`} />
			</RuleRow>
			<RuleRow title={chrome.i18n.getMessage('body')}>
				<ResponseBodyField
					name={`${namePrefix}.response.body`}
					allowOrigin
					fileFieldNote={chrome.i18n.getMessage('bodyReplacingContentTypeHeader')}
				/>
			</RuleRow>
		</div>
	);
});

RuleActionMutation.displayName = 'RuleActionMutation';
