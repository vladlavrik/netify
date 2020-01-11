import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';
import {Rule} from './rule';

export interface Log {
	requestId: string;
	interceptStage: 'Request' | 'Response' | 'Both';
	ruleId: Rule['id'];
	date: Date;
	resourceType: ResourceType;
	method: RequestMethod;
	url: string;
}
