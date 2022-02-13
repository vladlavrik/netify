import {RuleActionsType} from '@/constants/RuleActionsType';
import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';
import {ResponseErrorReason} from '@/constants/ResponseErrorReason';
import {HeadersArray} from '@/interfaces/headers';
import {RequestBody, ResponseBody} from './body';

export interface BreakpointAction {
	type: RuleActionsType.Breakpoint;
	request: boolean;
	response: boolean;
}

export interface MutationAction {
	type: RuleActionsType.Mutation;
	request: {
		endpoint?: string;
		method?: RequestMethod;
		setHeaders: HeadersArray;
		dropHeaders: string[];
		body?: RequestBody;
	};
	response: {
		statusCode?: number;
		setHeaders: HeadersArray;
		dropHeaders: string[];
		body?: ResponseBody;
	};
}

export interface LocalResponseAction {
	type: RuleActionsType.LocalResponse;
	statusCode: number;
	headers: HeadersArray;
	body: ResponseBody;
}

export interface FailureAction {
	type: RuleActionsType.Failure;
	reason: ResponseErrorReason;
}

export interface DelayAction {
	type: RuleActionsType.Delay;
	timeout: number;
}

export type Action = BreakpointAction | MutationAction | LocalResponseAction | FailureAction | DelayAction;

export interface Rule {
	id: string;
	label?: string;
	active: boolean;
	filter: {
		url: string;
		resourceTypes: ResourceType[];
		methods: RequestMethod[];
	};
	action: Action;
}
