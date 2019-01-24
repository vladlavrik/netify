import {Rule} from './Rule';
import {RequestMethod} from '@/debugger/constants/RequestMethod'
import {ResourceType} from '@/debugger/constants/ResourceType'

export interface Log {
	id: string, // uses "interceptorId"
	ruleId: Rule['id'],
	loaded: boolean;
	date: Date,
	resourceType: ResourceType,
	method: RequestMethod,
	url: string,
}


