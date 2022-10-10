import {action, computed, makeObservable, observable, toJS} from 'mobx';
import {Rule} from '@/interfaces/rule';
import {RulesExporter, RulesImporter} from '@/services/rulesImportExport';
import {RulesMapper} from '@/services/rulesMapper';

export class RulesStore {
	list: Rule[] = [];

	/** If checked - only rules created within the current page origin will be shown in the list of rules */
	filterByOrigin = true;

	/** Show a rule details on the secondary panel */
	detailsShownFor: null | string = null;
	composeShown = false;
	editorShownFor: null | string = null;

	currentOrigin = '';

	exportMode = false;

	selectedIds: Rule['id'][] = [];

	/** Active (not disabled) rules from actual rules list */
	get activeRules() {
		return this.list.filter((rule) => rule.active);
	}

	get hasActiveRules() {
		return this.activeRules.length !== 0;
	}

	get hasAnyRules() {
		return this.list.length !== 0;
	}

	/** Returns the origin by which the rules should be filtered, if the filter by page origin option is active */
	get originToFilter() {
		return this.filterByOrigin ? this.currentOrigin : undefined;
	}

	get detailedRule() {
		const ruleId = this.detailsShownFor;
		if (ruleId) {
			return this.list.find((rule) => rule.id === ruleId);
		}
		return undefined;
	}

	get editingRule() {
		const ruleId = this.editorShownFor;
		if (ruleId) {
			return this.list.find((rule) => rule.id === ruleId);
		}
		return undefined;
	}

	get hasSelectedRules() {
		return this.selectedIds.length !== 0;
	}

	get selectedRules() {
		const {selectedIds} = this;
		return this.list.filter((rule) => selectedIds.includes(rule.id));
	}

	get isAllRulesSelected() {
		return this.list.length === this.selectedIds.length;
	}

	constructor(private rulesMapper: RulesMapper) {
		makeObservable(this, {
			list: observable,
			filterByOrigin: observable,
			detailsShownFor: observable,
			composeShown: observable,
			editorShownFor: observable,
			currentOrigin: observable,
			exportMode: observable,
			selectedIds: observable,
			activeRules: computed,
			hasActiveRules: computed,
			hasAnyRules: computed,
			originToFilter: computed,
			detailedRule: computed,
			editingRule: computed,
			hasSelectedRules: computed,
			selectedRules: computed,
			isAllRulesSelected: computed,
			setRules: action('setRules'),
			addRules: action('addRules'),
			patchRule: action('patchRule'),
			unsetRule: action('unsetRule'),
			setCurrentOrigin: action('setCurrentOrigin'),
			showDetails: action('showDetails'),
			closeDetails: action('closeDetails'),
			showCompose: action('showCompose'),
			closeCompose: action('closeCompose'),
			showEditor: action('showEditor'),
			closeEditor: action('closeEditor'),
			toggleFilterByOrigin: action('toggleFilterByOrigin'),
			initExport: action('initExport'),
			finishExport: action('cancelExport'),
			selectItem: action('selectItem'),
			unselectItem: action('unselectItem'),
			selectAll: action('selectAll'),
			unselectAll: action('unselectAll'),
		});
	}

	setRules(rules: Rule[]) {
		this.list = rules;
	}

	addRules(rules: Rule[]) {
		this.list.unshift(...rules);
	}

	patchRule(data: Rule) {
		const rule = this.list.find((item) => item.id === data.id);
		if (rule) {
			Object.assign(rule, data);
		}
	}

	unsetRule(ruleId: string) {
		const index = this.list.findIndex((item) => item.id === ruleId);
		if (index !== -1) {
			this.list.splice(index, 1);
		}
	}

	setCurrentOrigin(currentOrigin: string) {
		this.currentOrigin = currentOrigin;
	}

	showDetails(ruleId: string) {
		this.detailsShownFor = ruleId;
	}

	closeDetails() {
		this.detailsShownFor = null;
	}

	showCompose() {
		this.composeShown = true;
	}

	closeCompose() {
		this.composeShown = false;
	}

	showEditor(ruleId: string) {
		this.editorShownFor = ruleId;
	}

	closeEditor() {
		this.editorShownFor = null;
	}

	toggleFilterByOrigin() {
		this.filterByOrigin = !this.filterByOrigin;
	}

	initExport() {
		this.exportMode = true;
		this.selectedIds = this.list.map((rule) => rule.id);
	}

	finishExport() {
		this.exportMode = false;
		this.selectedIds = [];
	}

	selectItem(ruleId: string) {
		this.selectedIds.push(ruleId);
	}

	unselectItem(ruleId: string) {
		const index = this.selectedIds.indexOf(ruleId);
		if (index !== -1) {
			this.selectedIds.splice(index, 1);
		}
	}

	selectAll() {
		this.selectedIds = this.list.map((item) => item.id);
	}

	unselectAll() {
		this.selectedIds = [];
	}

	async fetchRules() {
		let list;
		try {
			list = await this.rulesMapper.getList(this.originToFilter);
		} catch (error) {
			console.error(error);
			return;
		}

		this.setRules(list);
		this.closeCompose();
	}

	async createRule(rule: Rule) {
		try {
			await this.rulesMapper.saveNewItem(rule, this.currentOrigin);
		} catch (error) {
			console.error(error);
			return;
		}

		this.addRules([rule]);
		this.closeCompose();
	}

	async updateRule(rule: Rule) {
		try {
			await this.rulesMapper.updateItem(toJS(rule));
		} catch (error) {
			console.error(error);
			return;
		}

		this.patchRule(rule);
		this.closeEditor();
	}

	async importRules(file: File) {
		let importResult;
		try {
			importResult = await new RulesImporter().import(file);
		} catch (error) {
			console.error(error);
			return;
		}

		if (!importResult.success) {
			console.error(importResult.error);
			return;
		}

		let rules = importResult.rules;

		let saveResult;
		try {
			saveResult = await this.rulesMapper.saveNewMultipleItems(rules, this.currentOrigin);
		} catch (error) {
			console.error(error);
			return;
		}

		// Report failed rules import
		if (saveResult.some((result) => result.status === 'rejected')) {
			console.group('Can`t save some imported rule due an error');
			saveResult.forEach((result, index) => {
				if (result.status === 'rejected') {
					console.log('Rule source', rules[index]);
					console.error(result.reason);
				}
			});
			console.groupEnd();
		}

		const saveResultStatuses = saveResult.map((result) => result.status);
		rules = rules.filter((_, index) => saveResultStatuses[index] === 'fulfilled');

		this.addRules(rules);
	}

	async exportRules() {
		let saveResult;
		try {
			saveResult = await new RulesExporter().export(this.selectedRules);
		} catch (error) {
			console.log('Can`t export rules due uncaught error');
			console.error(error);
			return;
		}

		if (!saveResult.success) {
			console.log('Can`t export rules error');
			console.error(saveResult.error);
			return;
		}

		this.finishExport();
	}

	async removeRule(ruleId: string) {
		try {
			await this.rulesMapper.removeItem(ruleId);
		} catch (error) {
			console.error(error);
			return;
		}

		this.unsetRule(ruleId);
		if (this.detailsShownFor === ruleId) {
			this.closeDetails();
		}
	}

	async removeAllRules() {
		try {
			await this.rulesMapper.removeAll(this.originToFilter);
		} catch (error) {
			console.error(error);
			return;
		}

		this.setRules([]);
		this.closeDetails();
	}
}
