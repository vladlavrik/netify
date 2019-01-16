import {observable, action} from 'mobx';
import {Rule} from '@/debugger/interfaces/Rule';
import {RootStore} from '@/components/App/RootStore';
import {RequestMethod} from '@/debugger/constants/RequestMethod';
import {ResourceType} from '@/debugger/constants/ResourceType';
import {UrlCompareType} from '@/debugger/constants/UrlCompareType';
import {RulesManager} from '@/debugger/interfaces/RulesManager';

export class RulesStore implements RulesManager {
	constructor(private rootStore: RootStore) {
	}

	@observable
	readonly list: Rule[] = [];

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

	selectOne(select: {url: string, method: RequestMethod, resourceType: ResourceType}) {
		return this.list.find(({filter}) => {
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
	}
}
