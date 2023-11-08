import React, {memo} from 'react';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {ResponseBodyField} from '@/components/@common/formsKit/ResponseBodyField';
import {SetHeadersField} from '@/components/@common/formsKit/SetHeadersField';
import {StatusCodeField} from '@/components/@common/formsKit/StatusCodeField';
import {RuleDelayField} from '../RuleDelayField';
import {RuleRow} from '../RuleRow';

export const RuleActionLocalResponse = memo(() => {
	const namePrefix = `actionConfigs.${RuleActionsType.LocalResponse}`;

	return (
		<div>
			<RuleRow title={chrome.i18n.getMessage('delayMs')}>
				<RuleDelayField name={`${namePrefix}.delay`} />
			</RuleRow>
			<RuleRow title={chrome.i18n.getMessage('statusCode')}>
				<StatusCodeField name={`${namePrefix}.statusCode`} />
			</RuleRow>
			<RuleRow title={chrome.i18n.getMessage('setHeaders')}>
				<SetHeadersField name={`${namePrefix}.headers`} />
			</RuleRow>
			<RuleRow title={chrome.i18n.getMessage('body')}>
				<ResponseBodyField
					name={`${namePrefix}.body`}
					fileFieldNote={chrome.i18n.getMessage('bodyReplacingContentTypeHeader')}
				/>
			</RuleRow>
		</div>
	);
});

RuleActionLocalResponse.displayName = 'RuleActionLocalResponse';
