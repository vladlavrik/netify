import {ActionsType} from '@/constants/ActionsType';
import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';
import {ResponseErrorReason} from '@/constants/ResponseErrorReason';
import {HeadersArray} from '@/interfaces/headers';
import {RequestBody, ResponseBody} from './body';

export interface RulesSelector {
	selectOne(select: {url: string; method: RequestMethod; resourceType: ResourceType}): Rule | null;
}

export interface BreakpointAction {
	type: ActionsType.Breakpoint,
	request: boolean;
	response: boolean;
}

export interface MutationAction {
	type: ActionsType.Mutation,
	request: {
		endpoint?: string;
		method?: RequestMethod;
		setHeaders: HeadersArray,
		dropHeaders: string[],
		body?: RequestBody;
	};
	response: {
		statusCode?: number;
		setHeaders: HeadersArray,
		dropHeaders: string[],
		body?: ResponseBody;
	};
}

export interface LocalResponseAction {
	type: ActionsType.LocalResponse,
	statusCode: number;
	headers: HeadersArray;
	body: ResponseBody;
}

export interface FailureAction {
	type: ActionsType.Failure,
	reason: ResponseErrorReason;
}

export type Action = BreakpointAction | MutationAction | LocalResponseAction | FailureAction;

export interface Rule {
	id: string;
	active: boolean, // TODO use it
	filter: {
		url: string;
		resourceTypes: ResourceType[];
		methods: RequestMethod[];
	};
	action: Action
}
