import {Rule} from './Rule';
import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';

export interface RulesManager {
	selectOne(select: {url: string; method: RequestMethod; resourceType: ResourceType}): Rule | null;
}
