export enum RuleActionsType {
	Breakpoint = 'Breakpoint',
	Mutation = 'Mutation',
	LocalResponse = 'LocalResponse',
	Failure = 'Failure',
}

export const ruleActionsTypesList = [
	RuleActionsType.Breakpoint,
	RuleActionsType.Mutation,
	RuleActionsType.LocalResponse,
	RuleActionsType.Failure,
];

export const ruleActionsTypeHumanTitles: Record<RuleActionsType, string> = {
	[RuleActionsType.Breakpoint]: 'Breakpoint',
	[RuleActionsType.Mutation]: 'Mutation',
	[RuleActionsType.LocalResponse]: 'Local response',
	[RuleActionsType.Failure]: 'Failure',
};
