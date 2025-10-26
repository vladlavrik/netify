import {action, computed, observable, toJS} from 'mobx';
import {Rule} from '@/interfaces/rule';
import {RulesExporter, RulesImporter} from '@/services/rulesImportExport';
import {RulesMapper} from '@/services/rulesMapper';
import {RootStore} from './RootStore';

export class RulesStore {
	@observable
	accessor list: Rule[] = [];

	/** If checked - only rules created within the current page origin are shown in the list of rules */
	@observable
	accessor filterByOrigin = true;

	/** Show a rule details on the secondary panel */
	@observable
	accessor detailsShownFor: null | string = null;

	@observable
	accessor composeShown = false;

	@observable
	accessor editorShownFor: null | string = null;

	@observable
	accessor removeConfirmShownFor: null | string[] | 'all' = null;

	@observable
	accessor multiselectMode = false;

	@observable
	accessor selectedIds = new Set<Rule['id']>();

	listFetching = false;

	/** Active (not disabled) rules from an actual rules list */
	@computed
	get activeRules() {
		return this.list.filter((rule) => rule.active);
	}

	@computed
	get hasActiveRules() {
		return this.activeRules.length !== 0;
	}

	@computed
	get hasAnyRules() {
		return this.list.length !== 0;
	}

	/**
	 * Returns the origin by which the rules should be filtered if the filter by page origin option is active.
	 * It returns a special value "[empty origin]" when the filter by origin is active, but the selected tab origin is not defined
	 */
	get originToFilter() {
		return this.filterByOrigin ? (this.rootStore.tabStore.targetTabUrlOrigin ?? '[empty origin]') : undefined;
	}

	@computed
	get detailedRule() {
		const ruleId = this.detailsShownFor;
		if (ruleId) {
			return this.getById(ruleId);
		}
		return undefined;
	}

	@computed
	get editingRule() {
		const ruleId = this.editorShownFor;
		if (ruleId) {
			return this.getById(ruleId);
		}
		return undefined;
	}

	@computed
	get hasSelectedRules() {
		return this.selectedIds.size !== 0;
	}

	@computed
	get selectedRules() {
		const {selectedIds} = this;
		return this.list.filter((rule) => selectedIds.has(rule.id));
	}

	@computed
	get isAllRulesSelected() {
		return this.list.length === this.selectedIds.size;
	}

	@computed
	get isSelectedHasActive() {
		return this.selectedRules.some((item) => item.active);
	}

	@computed
	get isSelectedHasInactive() {
		return this.selectedRules.some((item) => !item.active);
	}

	constructor(
		private rootStore: RootStore,
		private rulesMapper: RulesMapper,
	) {}

	private getById(ruleId: string) {
		return this.list.find((rule) => rule.id === ruleId);
	}

	@action('private')
	private setRules(rules: Rule[]) {
		this.list = rules;
	}

	@action('private')
	private addRules(rules: Rule[]) {
		this.list.unshift(...rules);
	}

	@action('private')
	private patchRule(data: Rule) {
		const rule = this.getById(data.id);
		if (rule) {
			Object.assign(rule, data);
		}
	}

	@action('private')
	private unsetRule(ruleId: string) {
		const index = this.list.findIndex((item) => item.id === ruleId);
		if (index !== -1) {
			this.list.splice(index, 1);
		}
	}

	@action('showDetails')
	showDetails(ruleId: string) {
		this.detailsShownFor = ruleId;
	}

	@action('closeDetails')
	closeDetails() {
		this.detailsShownFor = null;
	}

	@action('showCompose')
	showCompose() {
		this.composeShown = true;
	}

	@action('closeCompose')
	closeCompose() {
		this.composeShown = false;
	}

	@action('showEditor')
	showEditor(ruleId: string) {
		this.editorShownFor = ruleId;
	}

	@action('closeEditor')
	closeEditor() {
		this.editorShownFor = null;
	}

	@action('toggleFilterByOrigin')
	toggleFilterByOrigin() {
		this.filterByOrigin = !this.filterByOrigin;
	}

	@action('initRemoveConfirm')
	initRemoveConfirm(ruleIds: string[]) {
		this.removeConfirmShownFor = ruleIds;
	}

	@action('initRemoveAllConfirm')
	initRemoveAllConfirm() {
		this.removeConfirmShownFor = 'all';
	}

	@action('finishRemoveConfirm')
	finishRemoveConfirm() {
		this.removeConfirmShownFor = null;
	}

	@action('initMultiselect')
	initMultiselect() {
		this.multiselectMode = true;
	}

	@action('finishMultiselect')
	finishMultiselect() {
		this.multiselectMode = false;
		this.selectedIds = new Set();
	}

	@action('selectItems')
	selectItems(ruleIds: string[]) {
		for (const rule of ruleIds) {
			this.selectedIds.add(rule);
		}
	}

	@action('unselectItems')
	unselectItems(ruleIds: string[]) {
		const removeRuleIds = new Set(ruleIds);
		this.selectedIds = this.selectedIds.difference(removeRuleIds);
	}

	@action('selectAll')
	selectAll() {
		this.selectedIds = new Set(this.list.map((item) => item.id));
	}

	@action('unselectAll')
	unselectAll() {
		this.selectedIds.clear();
	}

	async fetchRules() {
		this.listFetching = true;
		let list;
		try {
			list = await this.rulesMapper.getList(this.originToFilter);
		} catch (error) {
			console.error(error);
			return;
		} finally {
			this.listFetching = false;
		}

		this.setRules(list);
		this.closeCompose();
	}

	async createRule(rule: Rule) {
		const currentOrigin = this.rootStore.tabStore.targetTabUrlOrigin!;

		try {
			await this.rulesMapper.saveNewItem(rule, currentOrigin);
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
	}

	async updateRuleActive(ruleId: string, active: boolean) {
		const rule = this.getById(ruleId);
		if (rule) {
			return this.updateRule({...toJS(rule), active});
		}
	}

	async importRules(file: File) {
		let importResult;
		try {
			importResult = await new RulesImporter().import(file);
		} catch (error) {
			importResult = {
				success: false as const,
				error,
			};
		}

		if (!importResult.success) {
			console.log('Import rules error');
			console.error(importResult.error);
			this.rootStore.errorLogsStore.addLogEntry({
				title: "Can't import rules, probably the selected file is not invalid",
				error: importResult.error,
			});
			return;
		}

		const currentOrigin = this.rootStore.tabStore.targetTabUrlOrigin!;
		const importedRules = importResult.rules;

		let saveResult;
		try {
			saveResult = await this.rulesMapper.saveNewMultipleItems(importedRules, currentOrigin);
		} catch (error) {
			console.error(error);
			this.rootStore.errorLogsStore.addLogEntry({
				title: "Can't save imported rules",
				error,
			});
			return;
		}

		// Report failed rules import
		const firstFailedResult = saveResult.find(
			(result) => result.status === 'rejected',
		) as PromiseRejectedResult | void;

		if (firstFailedResult) {
			console.group("Can't save some imported rule due an error");
			saveResult.forEach((result, index) => {
				if (result.status === 'rejected') {
					console.log('Rule source', importedRules[index]);
					console.error(result.reason);
				}
			});
			console.groupEnd();
			this.rootStore.errorLogsStore.addLogEntry({
				title: 'Some of the imported rules are not saved',
				error: firstFailedResult.reason,
			});
		}

		const saveResultStatuses = saveResult.map((result) => result.status);
		const savedRules = importedRules.filter((_, index) => saveResultStatuses[index] === 'fulfilled');

		this.addRules(savedRules);
	}

	async exportRules(rules: Rule[]) {
		let saveResult;
		try {
			saveResult = await new RulesExporter().export(rules);
		} catch (error) {
			saveResult = {
				success: false as const,
				error,
			};
		}

		if (!saveResult.success) {
			console.log('Export rules error');
			console.error(saveResult.error);

			this.rootStore.errorLogsStore.addLogEntry({
				title: "Can't export rules lis",
				error: saveResult.error,
			});
		}

		return {success: saveResult.success};
	}

	async removeRules(ruleIds: string[]) {
		try {
			await this.rulesMapper.removeItems(ruleIds);
		} catch (error) {
			console.error(error);
			return;
		}

		this.finishRemoveConfirm();
		for (const ruleId of ruleIds) {
			this.unsetRule(ruleId);
		}

		if (this.detailsShownFor && ruleIds.includes(this.detailsShownFor)) {
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

		this.finishRemoveConfirm();
		this.unselectAll();
		this.setRules([]);
		this.closeDetails();
	}
}
