import {Rule} from './Rule';
import {RequestMethods} from './RequestMethods'
import {RequestTypes} from './RequestTypes'

export interface Log {
	requestId: number,
	ruleId: Rule['id'],
	date: Date,
	requestType: RequestTypes,
	method: RequestMethods,
	url: string,
}


