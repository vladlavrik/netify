export class ExtensionIcon {
	constructor(private readonly tabId: number, private readonly extName: string) {}

	makeActive() {
		const {tabId, extName} = this;
		const title = `${extName} (Active)`;
		chrome.pageAction.show(tabId);
		chrome.pageAction.setTitle({tabId, title});
	}

	makeInactive() {
		const {tabId, extName} = this;
		const title = `${extName} (Inactive)`;
		chrome.pageAction.hide(tabId);
		chrome.pageAction.setTitle({tabId, title});
	}
}
