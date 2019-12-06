import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';
import {UrlCompareType} from '@/constants/UrlCompareType';
import {ResponseErrorReason} from '@/constants/ResponseErrorReason';
import {HeadersArray} from '@/interfaces/headers';
import {RequestBody, ResponseBody} from './body';

export interface RulesSelector {
	selectOne(select: {url: string; method: RequestMethod; resourceType: ResourceType}): Rule | null;
}

export interface BreakpointAction {
	type: 'breakpoint',
	request: boolean;
	response: boolean;
}

export interface MutationAction {
	type: 'mutation',
	request: {
		endpoint?: string;
		method?: RequestMethod;
		headers: {
			add: HeadersArray;
			remove: string[];
		};
		body?: RequestBody;
	};
	response: {
		statusCode: number | null;
		headers: {
			add: HeadersArray;
			remove: string[];
		};
		body?: ResponseBody;
	};
}

export interface LocalResponseAction {
	type: 'localResponse',
	statusCode: number;
	headers: HeadersArray;
	body: ResponseBody;
}

export interface FailureAction {
	type: 'failure',
	reason: ResponseErrorReason;
}

type Action = BreakpointAction | MutationAction | LocalResponseAction | FailureAction;

export interface Rule {
	id: string;
	active: boolean, // TODO use it
	filter: {
		url: {
			value: string;
			compareType: UrlCompareType;
		};
		resourceTypes: ResourceType[];
		methods: RequestMethod[];
	};
	action: Action
}
