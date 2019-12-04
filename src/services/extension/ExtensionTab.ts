export class ExtensionTab {
	constructor(private readonly tabId: number) {}

	async getUrl() {
		const {url}: {url?: string} = await new Promise(resolve => chrome.tabs.get(this.tabId, resolve));
		if (!url) {
			throw new Error("Can't get target tab url");
		}

		return url;
	}
}
