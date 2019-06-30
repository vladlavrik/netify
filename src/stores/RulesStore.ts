import {action, observable, computed, toJS} from 'mobx';
import {openIDB, getOpenedIDB, RulesMapper} from '@/indexedDB';
import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';
import {UrlCompareType} from '@/constants/UrlCompareType';
import {RulesManager} from '@/interfaces/RulesManager';
import {Rule} from '@/interfaces/Rule';
import {RootStore} from './RootStore';

export class RulesStore implements RulesManager {
	private IDBMapper?: RulesMapper;

	constructor(private rootStore: RootStore) {}

	@observable
	readonly list: Rule[] = [];

	@observable
	highlightedId: string | null = null;

	@observable
	removeConfirmationId: string | null = null;

	@observable
	clearAllConfirmation = false;

	@computed
	get listIsEmpty() {
		return this.list.length === 0;
	}

	checkItemExists(id: string) {
		return this.list.some(item => item.id === id);
	}

	async initialize(tabUrl: string) {
		await this.connectIDB(tabUrl);
		await this.readFromDatabase();
	}

	private async connectIDB(tabUrl: string) {
		try {
			await openIDB();
		} catch (error) {
			this.reportException(`Exception on open IndexedDB:\n${error.message}`);
			throw error;
		}

		const hostname = tabUrl
			.split('/')
			.slice(0, 3)
			.join('/');

		this.IDBMapper = new RulesMapper(getOpenedIDB(), hostname);
	}

	private async readFromDatabase() {
		let rules: Rule[];
		try {
			rules = await this.IDBMapper!.getList();
		} catch (error) {
			this.reportException(`Exception on get rules lift from IndexedDB:\n${error.message}`);
			throw error;
		}

		this.list.push(...rules);
	}

	private reportException(error: string) {
		this.rootStore.appStore.setDisplayedError(error);
	}

	@action
	create(rule: Rule) {
		this.list.push(rule);
		this.rootStore.appStore.hideCompose();

		this.IDBMapper!.saveNewItem(rule).catch(error => {
			this.reportException(`Exception on save a new rule to IndexedDB:\n${error.message}`);
			throw error;
		});
	}

	@action
	save(rule: Rule) {
		const index = this.list.findIndex(item => item.id === rule.id);
		this.list.splice(index, 1, rule);

		this.rootStore.appStore.hideRuleEditor();

		this.IDBMapper!.updateItem(rule).catch(error => {
			this.reportException(`Exception on update a rule to IndexedDB:\n${error.message}`);
			throw error;
		});
	}

	@action
	setHighlighted(id: string | null = null) {
		// todo add "item"
		this.highlightedId = id;
	}

	@action
	askToRemoveItem(id: string) {
		this.removeConfirmationId = id;
	}

	@action
	cancelRemove() {
		this.removeConfirmationId = null;
	}

	@action
	confirmRemove() {
		const index = this.list.findIndex(item => item.id === this.removeConfirmationId);
		const id = this.removeConfirmationId!;
		this.list.splice(index, 1);
		this.removeConfirmationId = null;

		this.IDBMapper!.removeItem(id).catch(error => {
			this.reportException(`Exception on remove rule from IndexedDB:\n${error.message}`);
			throw error;
		});
	}

	@action
	askToClearAll() {
		this.clearAllConfirmation = true;
	}

	@action
	cancelClearAll() {
		this.clearAllConfirmation = false;
	}

	@action
	confirmClearAll() {
		this.list.splice(0, this.list.length);
		this.clearAllConfirmation = false;

		this.IDBMapper!.removeAll().catch(error => {
			this.reportException(`Exception on remove all rule from IndexedDB:\n${error.message}`);
			throw error;
		});
	}

	selectOne(select: {url: string; method: RequestMethod; resourceType: ResourceType}) {
		// TODO to debugger dir
		const selectUrlOrigin = select.url
			.split('/')
			.slice(0, 3) // first double slash is the end of schema, third slash is the path part start
			.join('/');

		const rule = this.list.find(({filter}) => {
			if (filter.resourceTypes.length && !filter.resourceTypes.includes(select.resourceType)) {
				return false;
			}

			if (filter.methods.length && !filter.methods.includes(select.method)) {
				return false;
			}

			// if the filter does not include a schema and host, add it for correct comparison
			const filterUrlValue = filter.url.value.startsWith('/') // it mean schema and host is not defined
				? selectUrlOrigin + filter.url.value
				: filter.url.value;

			if (filter.url.compareType === UrlCompareType.Exact && select.url !== filterUrlValue) {
				return false;
			}

			if (filter.url.compareType === UrlCompareType.StartsWith && !select.url.startsWith(filterUrlValue)) {
				return false;
			}

			if (filter.url.compareType === UrlCompareType.RegExp && !RegExp(filterUrlValue).test(select.url)) {
				return false;
			}

			return true;
		});

		if (rule) {
			return toJS(rule);
		}

		return null;
	}
}
