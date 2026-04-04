import {SettingsMapper} from '@/services/settingsMapper';

const settingsMapper = new SettingsMapper();
const allowDevtoolsPanel = await settingsMapper.getValue('allowDevtoolsPanel');

// "tabId" can be undefined in some specific case like debugging a chrome side panel
const {tabId} = chrome.devtools.inspectedWindow;

if (allowDevtoolsPanel && tabId) {
	let tabName = 'Netify';
	if (process.env.NODE_ENV === 'development') {
		tabName += ' (dev)';
	}

	chrome.devtools.panels.create(tabName, 'icons/logo-16.png', `application.html?mode=devtools&tabId=${tabId}`);
}
