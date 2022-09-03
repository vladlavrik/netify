import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';
import {Rule} from './rule';

export interface LogEntry {
	requestId: string;
	interceptStage: 'Request' | 'Response' | 'Both';
	ruleId: Rule['id'];
	timestamp: number;
	resourceType: ResourceType;
	method: RequestMethod;
	url: string;
}
