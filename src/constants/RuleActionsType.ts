export enum RuleActionsType {
	Breakpoint = 'Breakpoint',
	Mutation = 'Mutation',
	LocalResponse = 'LocalResponse',
	Failure = 'Failure',
	Delay = 'Delay',
}

export const ruleActionsTypesList = [
	RuleActionsType.Breakpoint,
	RuleActionsType.Mutation,
	RuleActionsType.LocalResponse,
	RuleActionsType.Failure,
	RuleActionsType.Delay,
];

export const ruleActionsTypeHumanTitles: Record<RuleActionsType, string> = {
	[RuleActionsType.Breakpoint]: 'Breakpoint',
	[RuleActionsType.Mutation]: 'Mutation',
	[RuleActionsType.LocalResponse]: 'Local response',
	[RuleActionsType.Failure]: 'Failure',
	[RuleActionsType.Delay]: 'Delay',
};
