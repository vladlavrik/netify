import activeIcon from '@/style/icons/logo-32.png';
import inactiveIcon from '@/style/icons/logo-inactive-32.png';

export class ExtensionIcon {
	constructor(private readonly tabId: number, private readonly extName: string) {}

	makeActive() {
		const {tabId, extName} = this;
		const title = `${extName} (Active)`;
		chrome.action.setIcon({tabId, path: activeIcon});
		chrome.action.setTitle({tabId, title});
	}

	makeInactive() {
		const {tabId, extName} = this;
		const title = `${extName} (Inactive)`;
		chrome.action.setIcon({tabId, path: inactiveIcon});
		chrome.action.setTitle({tabId, title});
	}
}
