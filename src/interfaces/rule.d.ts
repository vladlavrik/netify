import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';
import {UrlCompareType} from '@/constants/UrlCompareType';
import {CancelReasons} from '@/constants/CancelReasons';
import {RequestBody, ResponseBody} from './body';
import {HeadersArray} from '@/interfaces/headers';

export interface RulesSelector {
	selectOne(select: {url: string; method: RequestMethod; resourceType: ResourceType}): Rule | null;
}

export interface Rule {
	id: string;
	filter: {
		url: {
			value: string;
			compareType: UrlCompareType;
		};
		resourceTypes: ResourceType[];
		methods: RequestMethod[];
	};
	actions: {
		breakpoint: {
			request: boolean;
			response: boolean;
		};
		mutate: {
			request: {
				enabled: boolean;
				endpoint: string;
				method?: RequestMethod;
				headers: {
					add: HeadersArray;
					remove: string[];
				};
				body: RequestBody;
			};
			response: {
				enabled: boolean;
				responseLocally: boolean;
				statusCode: number | null;
				headers: {
					add: HeadersArray;
					remove: string[];
				};
				body: ResponseBody;
			};
		};
		cancel: {
			enabled: boolean;
			reason: CancelReasons;
		};
	}
}
