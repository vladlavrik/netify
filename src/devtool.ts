let tabName = 'Netify';
if (process.env.NODE_ENV === 'development') {
	tabName += ' (dev)';
}

chrome.devtools.panels.create(tabName, 'icons/logo-16.png', 'panel.html', (panel) => {
	const tabId = chrome.devtools.inspectedWindow.tabId;

	panel.onShown.addListener(() => {
		chrome.runtime.sendMessage({type: 'panelShowToggle', tabId, shown: true});
	});

	panel.onHidden.addListener(() => {
		chrome.runtime.sendMessage({type: 'panelShowChange', tabId, shown: false});
	});
});
