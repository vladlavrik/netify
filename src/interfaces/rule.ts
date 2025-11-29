import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';
import {ResponseErrorReason} from '@/constants/ResponseErrorReason';
import {RuleActionsType} from '@/constants/RuleActionsType';
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
		delay?: number;
		statusCode?: number;
		setHeaders: HeadersArray;
		dropHeaders: string[];
		body?: ResponseBody;
	};
}

export interface LocalResponseRuleAction {
	type: RuleActionsType.LocalResponse;
	delay?: number;
	statusCode: number;
	headers: HeadersArray;
	body: ResponseBody;
}

export interface FailureRuleAction {
	type: RuleActionsType.Failure;
	reason: ResponseErrorReason;
}

export interface ScriptRuleAction {
	type: RuleActionsType.Script;
	request: string;
	response: string;
}

export type RuleAction =
	| BreakpointRuleAction
	| MutationRuleAction
	| LocalResponseRuleAction
	| FailureRuleAction
	| ScriptRuleAction;

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

export interface RuleInitialData {
	filter?: Partial<Rule['filter']>;
}
