import {RuleActionsType} from '@/constants/RuleActionsType';
import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';
import {ResponseErrorReason} from '@/constants/ResponseErrorReason';
import {HeadersArray} from '@/interfaces/headers';
import {RequestBody, ResponseBody} from './body';

export interface BreakpointRuleAction {
	type: RuleActionsType.Breakpoint;
	request: boolean;
	response: boolean;
}

export interface MutationRuleAction {
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

export interface LocalResponseRuleAction {
	type: RuleActionsType.LocalResponse;
	statusCode: number;
	headers: HeadersArray;
	body: ResponseBody;
}

export interface FailureRuleAction {
	type: RuleActionsType.Failure;
	reason: ResponseErrorReason;
}

export type RuleAction = BreakpointRuleAction | MutationRuleAction | LocalResponseRuleAction | FailureRuleAction;

export interface Rule {
	id: string;
	label?: string;
	active: boolean;
	filter: {
		url: string;
		resourceTypes: ResourceType[];
		methods: RequestMethod[];
	};
	action: RuleAction;
}
