import {Event} from '@/helpers/Events';

export class ExtensionTab {
	private currentPageUrl?: URL;

	readonly pageUrlChangeEvent = new Event<{url: URL; originChanged: boolean}>();

	constructor(private readonly tabId: number) {
		chrome.tabs.onUpdated.addListener((changedTabId, {status, url: urlString}) => {
			if (changedTabId !== tabId || status !== 'loading' || !urlString) {
				return;
			}

			const url = new URL(urlString);
			const originChanged = !this.currentPageUrl || this.currentPageUrl.origin !== url.origin;
			this.pageUrlChangeEvent.emit({url, originChanged});
		});
	}

	async getPageUrl() {
		const {url}: {url?: string} = await new Promise(resolve => chrome.tabs.get(this.tabId, resolve));
		if (!url) {
			throw new Error("Can't get the target tab url");
		}

		return new URL(url);
	}
}
