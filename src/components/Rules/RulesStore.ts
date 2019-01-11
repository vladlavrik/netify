import {observable, action} from 'mobx';

export class RulesStore {
	@observable
	readonly list: RuleItem[] = [];

	@action
	add(item: RuleItem) {
		this.list.push(item);
	}
}

interface RuleItem {
	timestamp: number;
	ruleId: number;
}
