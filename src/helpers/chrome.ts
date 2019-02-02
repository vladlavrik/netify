export function getTargetTabUrl() {
	const tabId = chrome.devtools.inspectedWindow.tabId;

	return new Promise(resolve => chrome.tabs.get(tabId, resolve)).then((tab: {url?: string}) => {
		if (!tab || !tab.url) {
			throw new Error("Can't get target tab url");
		}

		return tab.url;
	});
}
