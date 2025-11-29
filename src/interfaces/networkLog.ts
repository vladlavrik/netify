import Protocol from 'devtools-protocol';
import {RequestMethod} from '@/constants/RequestMethod';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {Rule} from './rule';

type ResourceType = Protocol.Network.ResourceType;

export interface NetworkLogEntry {
	requestId: string;
	timestamp: number;
	resourceType: ResourceType;
	method: RequestMethod;
	url: string;
	responseStatusCode?: number;
	responseError?: string;

	modification?: {
		ruleId: Rule['id'];
		type: RuleActionsType;
		stage: 'Request' | 'Response' | 'Both';
	};
}
