import React, {memo} from 'react';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {StatusCodeField} from '@/components/forms/common/StatusCodeField';
import {SetHeadersField} from '@/components/forms/common/SetHeadersField';
import {ResponseBodyField} from '@/components/forms/common/ResponseBodyField';

export const RuleActionLocalResponse = memo(function RuleActionLocalResponse() {
	const namePrefix = `actionConfigs.${RuleActionsType.LocalResponse}`;

	return (
		<div>
			<StatusCodeField name={`${namePrefix}.statusCode`} />
			<SetHeadersField name={`${namePrefix}.headers`} />
			<ResponseBodyField name={`${namePrefix}.body`} />
		</div>
	);
});
