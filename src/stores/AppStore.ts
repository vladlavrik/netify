import {action, computed, observable, toJS} from 'mobx';
import {RootStore} from './RootStore';

export class AppStore {
	constructor(private rootStore: RootStore) {}

	@observable
	debuggerAllowed = true;

	@observable
	sectionRatio = 50;

	@observable
	logsCollapsed = false;

	@observable
	composeShown = false;

	@observable
	editingRuleId: string | null = null;

	@computed
	get editingRule() {
		return toJS(this.rootStore.rulesStore.list.find(item => item.id === this.editingRuleId));
	}

	@observable
	displayedError: string | null = null;

	@action
	disableDebugger() {
		this.debuggerAllowed = false;
	}

	@action
	toggleDebuggerAllowed() {
		this.debuggerAllowed = !this.debuggerAllowed;
	}

	@action
	setSectionRatio(ratio: number, logsCollapsed: boolean) {
		this.sectionRatio = ratio;
		this.logsCollapsed = logsCollapsed;
	}

	@action
	toggleLogsCollapse() {
		if (this.logsCollapsed) {
			this.sectionRatio = 50;
			this.logsCollapsed = false;
		} else {
			this.sectionRatio = 100;
			this.logsCollapsed = true;
		}
	}

	@action
	showCompose() {
		this.composeShown = true;
	}

	@action
	hideCompose() {
		this.composeShown = false;
	}

	@action
	showRuleEditor(ruleId: string) {
		this.editingRuleId = ruleId;
	}

	@action
	hideRuleEditor() {
		this.editingRuleId = null;
	}

	@action
	setDisplayedError(error: string) {
		this.displayedError = error;
	}

	@action
	resetDisplayedError() {
		this.displayedError = null;
	}
}
