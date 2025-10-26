import {action, computed, observable} from 'mobx';
import type {ExtensionTabManager} from '@/services/extension';

interface TabsData {
	id: number;
	url: string;
	title: string;
	windowId: number;
	favIconUrl?: string;
}

export class TabStore {
	@observable
	accessor targetTab: TabsData | null = null;

	@computed
	get targetTabUrlOrigin() {
		if (!this.targetTab?.url) {
			return undefined;
		}

		return new URL(this.targetTab?.url).origin;
	}

	@computed
	get targetTabHasPage() {
		const url = this.targetTab?.url;
		if (!url) {
			return false;
		}

		return url.startsWith('http://') || url.startsWith('https://');
	}

	constructor(private tabManager: ExtensionTabManager) {}

	@action('setTargetTab')
	setTargetTab(tab: TabsData) {
		const {id, windowId, url, title, favIconUrl} = tab;
		this.targetTab = {id, windowId, url, title, favIconUrl};
	}

	@action('updateTargetTab')
	updateTargetTab(tab: Partial<Omit<TabsData, 'id'>>) {
		if (this.targetTab && tab.url) {
			this.targetTab.url = tab.url;
		}
		if (this.targetTab && tab.title) {
			this.targetTab.title = tab.title;
		}
		if (this.targetTab && tab.favIconUrl) {
			this.targetTab.favIconUrl = tab.favIconUrl;
		}
	}

	async focusTargetTab() {
		return this.tabManager.focusTab(this.targetTab!.id, this.targetTab!.windowId);
	}
}
