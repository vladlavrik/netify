import {action, makeObservable, observable} from 'mobx';

export class AppUiStore {
	/** Is the devtool panel with the Netify active (shown), used to determinate is need to show notification */
	isPanelActive = true;

	/** Is the secondary section (with logs) shown */
	secondarySectionCollapsed = false;

	constructor() {
		makeObservable(this, {
			isPanelActive: observable,
			secondarySectionCollapsed: observable,
			setPanelActive: action('setPanelActive'),
			toggleSecondarySectionCollapse: action('toggleSecondarySectionCollapse'),
		});
	}

	setPanelActive(isPanelActive: boolean) {
		this.isPanelActive = isPanelActive;
	}

	toggleSecondarySectionCollapse() {
		this.secondarySectionCollapsed = !this.secondarySectionCollapsed;
	}
}
