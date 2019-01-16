import {Rule} from '@/debugger/interfaces/Rule';
import {RequestMethod} from '@/debugger/constants/RequestMethod';
import {ResourceType} from '@/debugger/constants/ResourceType';
import {UrlCompareType} from '@/debugger/constants/UrlCompareType';

export class RulesManager {
	readonly list: Rule[] = [];

	constructor() {
	}

	push(...rule: Rule[]) {
		this.list.push(...rule);
	}

	removeById(id: string) {
		const index = this.list.findIndex(item => item.id === id);
		this.list.splice(index, 1);
	}

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
