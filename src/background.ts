import {RuntimeMessage} from '@/interfaces/runtimeMessage';
import {ExtensionIcon} from '@/services/extension';
import {SettingsMapper} from '@/services/settingsMapper';

const settingsMapper = new SettingsMapper();

// Make opening the panel in devtools available for old users and disallow for new ones
chrome.runtime.onInstalled.addListener(async (details) => {
	const allowDevtoolsPanelValue = await settingsMapper.getValue('allowDevtoolsPanel');
	if (allowDevtoolsPanelValue === undefined) {
		settingsMapper.setValue('allowDevtoolsPanel', details.reason === chrome.runtime.OnInstalledReason.UPDATE);
	}
});

// Register of open instances (popups or panel in devtools)
// Used to prevent opening multiple instances at the same time for one tab
const openedInstances: Record<
	number,
	{type: 'popup'; windowId: number; instanceId: string} | {type: 'devtools'; instanceId: string}
> = {};

// Open popup on extension icon click
const openPopup = async (tab: chrome.tabs.Tab) => {
	const openedInstance = openedInstances[tab.id!];
	if (openedInstance) {
		if (openedInstance.type === 'popup') {
			chrome.windows.update(openedInstance.windowId, {focused: true});
		} else {
			// TODO notify to user reason
		}
		return;
	}

	await chrome.windows.create({
		url: `application.html?mode=popup&tabId=${tab.id}`,
		width: 800,
		height: 600,
		type: 'panel',
	});
};

// Add opening action on extension icon click
chrome.action.onClicked.addListener((tab) => {
	openPopup(tab);
});

// Define extension icons context menu
chrome.contextMenus.removeAll();
chrome.contextMenus.create({
	id: 'runPopup',
	contexts: ['action'],
	title: 'Launch in popup',
});
chrome.contextMenus.create({
	id: 'allowDevtoolsPanel',
	contexts: ['action'],
	type: 'checkbox',
	title: 'Allow Devtools panel',
	checked: false,
});

settingsMapper.getValue('allowDevtoolsPanel').then((value) => {
	chrome.contextMenus.update('allowDevtoolsPanel', {checked: value});
});

// Listen context menu acton click
chrome.contextMenus.onClicked.addListener((data, tab) => {
	switch (data.menuItemId) {
		case 'runPopup':
			if (tab) {
				openPopup(tab);
			}
			break;
		case 'allowDevtoolsPanel':
			settingsMapper.setValue('allowDevtoolsPanel', !!data.checked);
			break;
	}
});

// Listen runtime messages
chrome.runtime.onMessage.addListener((message: RuntimeMessage, sender) => {
	if (sender.id !== chrome.runtime.id) {
		return;
	}

	switch (message.name) {
		case 'registerInstance': {
			// Close opened popup for this tab
			const openedInstance = openedInstances[message.tabId];
			if (openedInstance) {
				if (openedInstance.type === 'popup') {
					chrome.windows.remove(openedInstance.windowId);
				} else {
					// TODO notify about a problem
				}
			}

			openedInstances[message.tabId] =
				message.instanceType === 'devtools'
					? {type: 'devtools', instanceId: message.instanceId}
					: {type: 'popup', instanceId: message.instanceId, windowId: sender.tab!.windowId};
			break;
		}

		case 'unregisterInstance':
			if (openedInstances[message.tabId]?.instanceId === message.instanceId) {
				delete openedInstances[message.tabId];

				// Make icon inactive (in case of popup making icon inactive action on beforeunload if not working)
				if (message.instanceType === 'popup') {
					const extensionIcon = new ExtensionIcon(message.tabId, message.instanceType);
					extensionIcon.makeInactive();
				}
			}
			break;
	}
});
