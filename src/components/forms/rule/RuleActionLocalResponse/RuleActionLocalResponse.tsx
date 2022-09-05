import React, {memo} from 'react';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {ResponseBodyField} from '@/components/forms/common/ResponseBodyField';
import {SetHeadersField} from '@/components/forms/common/SetHeadersField';
import {StatusCodeField} from '@/components/forms/common/StatusCodeField';

export const RuleActionLocalResponse = memo(() => {
	const namePrefix = `actionConfigs.${RuleActionsType.LocalResponse}`;

	return (
		<div>
			<StatusCodeField name={`${namePrefix}.statusCode`} />
			<SetHeadersField name={`${namePrefix}.headers`} />
			<ResponseBodyField name={`${namePrefix}.body`} />
		</div>
	);
});

RuleActionLocalResponse.displayName = 'RuleActionLocalResponse';
