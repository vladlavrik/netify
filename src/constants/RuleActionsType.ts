export enum RuleActionsType {
	Breakpoint = 'Breakpoint',
	Mutation = 'Mutation',
	LocalResponse = 'LocalResponse',
	Failure = 'Failure',
}

export const ruleActionsTypesList = [
	RuleActionsType.Mutation,
	RuleActionsType.Breakpoint,
	RuleActionsType.LocalResponse,
	RuleActionsType.Failure,
];

export const ruleActionsTypeHumanTitles: Record<RuleActionsType, string> = {
	[RuleActionsType.Mutation]: 'Mutation',
	[RuleActionsType.Breakpoint]: 'Breakpoint',
	[RuleActionsType.LocalResponse]: 'Local response',
	[RuleActionsType.Failure]: 'Failure',
};
