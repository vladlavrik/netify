export enum RuleActionsType {
	Breakpoint = 'Breakpoint',
	Mutation = 'Mutation',
	LocalResponse = 'LocalResponse',
	Failure = 'Failure',
	Script = 'Script',
}

export const ruleActionsTypesList = [
	RuleActionsType.Mutation,
	RuleActionsType.Breakpoint,
	RuleActionsType.LocalResponse,
	RuleActionsType.Failure,
	RuleActionsType.Script,
];

export const ruleActionsTypeHumanTitles: Record<RuleActionsType, string> = {
	[RuleActionsType.Mutation]: 'Mutation',
	[RuleActionsType.Breakpoint]: 'Breakpoint',
	[RuleActionsType.LocalResponse]: 'Local response',
	[RuleActionsType.Failure]: 'Failure',
	[RuleActionsType.Script]: 'Script',
};
