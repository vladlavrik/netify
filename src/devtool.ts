import {SettingsMapper} from '@/services/settingsMapper';

const settingsMapper = new SettingsMapper();
const allowDevtoolsPanel = await settingsMapper.getValue('allowDevtoolsPanel');

if (allowDevtoolsPanel) {
	let tabName = 'Netify';
	if (process.env.NODE_ENV === 'development') {
		tabName += ' (dev)';
	}

	const {tabId} = chrome.devtools.inspectedWindow;
	chrome.devtools.panels.create(tabName, 'icons/logo-16.png', `application.html?mode=devtools&tabId=${tabId}`);
}
