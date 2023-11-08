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
	[RuleActionsType.Mutation]: 'mutation',
	[RuleActionsType.Breakpoint]: 'breakpoint',
	[RuleActionsType.LocalResponse]: 'localResponse',
	[RuleActionsType.Failure]: 'failure',
};
