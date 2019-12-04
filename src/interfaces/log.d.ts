import {Rule} from './Rule';
import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';

interface Log {
	id: string; // is "requestId"
	ruleId: Rule['id'];
	loaded: boolean;
	date: Date;
	resourceType: ResourceType;
	method: RequestMethod;
	url: string;
}
