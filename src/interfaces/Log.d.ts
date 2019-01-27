import {Rule} from './Rule';
import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';

export interface Log {
	id: string; // uses "interceptorId"
	ruleId: Rule['id'];
	loaded: boolean;
	date: Date;
	resourceType: ResourceType;
	method: RequestMethod;
	url: string;
}
