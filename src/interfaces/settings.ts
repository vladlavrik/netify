export interface Settings {
	uiTheme: 'system' | 'light' | 'dark';

	/** If checked - only rules created within the current page origin are shown in the list of rules */
	filterRulesByOrigin: boolean;

	allowDevtoolsPanel: boolean;
}
