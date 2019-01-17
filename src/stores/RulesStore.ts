import {observable, action, toJS} from 'mobx';
import {Rule} from '@/debugger/interfaces/Rule';
import {RootStore} from './RootStore';
import Debugger from '@/debugger/Debugger';
import {RequestMethod} from '@/debugger/constants/RequestMethod';
import {ResourceType} from '@/debugger/constants/ResourceType';
import {UrlCompareType} from '@/debugger/constants/UrlCompareType';
import {RulesManager} from '@/debugger/interfaces/RulesManager';
import {Log} from '@/debugger/interfaces/Log';


export class RulesStore implements RulesManager {
	constructor(private rootStore: RootStore) {
	}

	private debugger = new Debugger({
		tabId: chrome.devtools.inspectedWindow.tabId as number,
		rulesManager: this,
		onRequestStart: (log: Log) => this.rootStore.logsStore.add(log),
		onRequestEnd: (id: string) => this.rootStore.logsStore.makeLoaded(id),
	});

	async initializeDebugger() {
		await this.debugger.initialize();
	}

	async destroyDebugger() {
		await this.debugger.destroy();
	}

	@observable
	readonly list: Rule[] = [];

	@observable
	highlightedId: string | null = null;

	@action
	save(...rules: Rule[]) {
		this.list.push(...rules);
		this.rootStore.appStore.hideCompose();
	}

	@action
	removeById(id: string) {
		const index = this.list.findIndex(item => item.id === id);
		this.list.splice(index, 1);
	}

	@action
	clearAll() {
		this.list.splice(0, this.list.length);
	}

	@action
	setHighlighted(id: string | null = null) {
		this.highlightedId = id;
	}

	selectOne(select: {url: string, method: RequestMethod, resourceType: ResourceType}) {
		const rule = this.list.find(({filter}) => {
			if (filter.resourceTypes.length && !filter.resourceTypes.includes(select.resourceType)) {
				return false;
			}

			if (filter.methods.length && !filter.methods.includes(select.method)) {
				return false;
			}

			if (filter.url.compareType === UrlCompareType.Exact && filter.url.value !== select.url) {
				return false;
			}

			if (filter.url.compareType === UrlCompareType.StartsWith && !select.url.startsWith(filter.url.value as string)) {
				return false;
			}

			if (filter.url.compareType === UrlCompareType.RegExp && !(filter.url.value as RegExp).test(select.url)) {
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
