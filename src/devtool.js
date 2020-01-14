chrome.devtools.panels.create('Netify', 'icons/logo-16.png', 'panel.html', panel => {
	panel.onShown.addListener(() => {
		chrome.runtime.sendMessage({type: 'panelShowToggle', shown: true});
	});
	panel.onHidden.addListener(() => {
		chrome.runtime.sendMessage({type: 'panelShowToggle', shown: false});
	});
});
