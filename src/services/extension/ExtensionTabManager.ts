import {EventBus} from '@/helpers/EventsBus';

type GetTabResult = RequiredProps<chrome.tabs.Tab, 'id' | 'url' | 'title'>;

export class ExtensionTabManager {
	readonly tabUpdateEvent = new EventBus<{url?: string; title?: string; favIconUrl?: string}>();
	readonly tabRemoveEvent = new EventBus();

	constructor(readonly tabId: number) {
		chrome.tabs.onUpdated.addListener((changedTabId, {url, title, favIconUrl, ...rest}) => {
			if (changedTabId === this.tabId) {
				this.tabUpdateEvent.emit({url, title, favIconUrl});
			}
		});

		chrome.tabs.onRemoved.addListener((removedTabId) => {
			if (removedTabId === this.tabId) {
				this.tabRemoveEvent.emit();
			}
		});
	}

	async getTabById(tabId: number) {
		return chrome.tabs.get(tabId) as Promise<GetTabResult>;
	}

	async focusTab(tabId: number, windowId: number) {
		return Promise.all([
			chrome.tabs.update(tabId, {active: true}),
			chrome.windows.update(windowId, {focused: true}),
		]);
	}
}
