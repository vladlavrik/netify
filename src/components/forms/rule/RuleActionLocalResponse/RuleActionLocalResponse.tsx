import React, {memo} from 'react';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {ResponseBodyField} from '@/components/@common/formsKit/ResponseBodyField';
import {SetHeadersField} from '@/components/@common/formsKit/SetHeadersField';
import {StatusCodeField} from '@/components/@common/formsKit/StatusCodeField';
import {RuleRow} from '../RuleRow';

export const RuleActionLocalResponse = memo(() => {
	const namePrefix = `actionConfigs.${RuleActionsType.LocalResponse}`;

	return (
		<div>
			<RuleRow title='Status code:'>
				<StatusCodeField name={`${namePrefix}.statusCode`} />
			</RuleRow>
			<RuleRow title='Set headers:'>
				<SetHeadersField name={`${namePrefix}.headers`} />
			</RuleRow>
			<RuleRow title='Body:'>
				<ResponseBodyField
					name={`${namePrefix}.body`}
					fileFieldNote='Body replacing will also rewrites "Content-Type" header'
				/>
			</RuleRow>
		</div>
	);
});

RuleActionLocalResponse.displayName = 'RuleActionLocalResponse';
