import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';
import {Rule} from './rule';

export interface Log {
	id: string; // Is "requestId"
	ruleId: Rule['id'];
	loaded: boolean;
	date: Date;
	resourceType: ResourceType;
	method: RequestMethod;
	url: string;
}
