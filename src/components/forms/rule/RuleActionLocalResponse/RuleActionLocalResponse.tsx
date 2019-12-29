import React, {memo} from 'react';
import {ActionsType} from '@/constants/ActionsType';
import {StatusCodeField} from '@/components/forms/common/StatusCodeField';
import {SetHeadersField} from '@/components/forms/common/SetHeadersField';
import {ResponseBodyField} from '@/components/forms/common/ResponseBodyField';

export const RuleActionLocalResponse = memo(() => {
	const namePrefix = `actionConfigs.${ActionsType.LocalResponse}`;

	return (
		<div>
			<StatusCodeField name={`${namePrefix}.statusCode`} />
			<SetHeadersField name={`${namePrefix}.headers`} />
			<ResponseBodyField name={`${namePrefix}.body`} />
		</div>
	);
});

RuleActionLocalResponse.displayName = 'RuleActionLocalResponse';
