import {RuntimeMode} from '@/interfaces/runtimeMode';
import activeIcon from '@/style/icons/logo-32.png';
import inactiveIcon from '@/style/icons/logo-inactive-32.png';

export class ExtensionIcon {
	private readonly extName = 'Netify';

	constructor(
		private readonly tabId: number,
		private runtimeMode: RuntimeMode,
	) {}

	makeActive() {
		const {extName, tabId, runtimeMode} = this;
		const title = `${extName} (${runtimeMode === 'devtools' ? 'Active in devtools' : 'Active'})`;
		chrome.action.setIcon({path: activeIcon, tabId});
		chrome.action.setTitle({title, tabId});
	}

	makeInactive() {
		const {extName, tabId} = this;
		const title = `${extName} (Inactive)`;
		chrome.action.setIcon({path: inactiveIcon, tabId});
		chrome.action.setTitle({title, tabId});
	}
}
