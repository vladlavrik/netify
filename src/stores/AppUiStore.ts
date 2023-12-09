import {action, makeObservable, observable} from 'mobx';

export class AppUiStore {
	/** Is the devtool panel with the Netify active (shown), used to determinate is need to show notification */
	isPanelActive = true;

	/* The general devtools theme name */
	themeName: 'default' | 'dark' = 'default';

	/** Is the secondary section (with logs) shown */
	secondarySectionCollapsed = false;

	constructor() {
		makeObservable(this, {
			isPanelActive: observable,
			themeName: observable,
			secondarySectionCollapsed: observable,
			setPanelActive: action('setPanelActive'),
			setThemeName: action('setThemeName'),
			toggleSecondarySectionCollapse: action('toggleSecondarySectionCollapse'),
		});
	}

	setPanelActive(isPanelActive: boolean) {
		this.isPanelActive = isPanelActive;
	}

	setThemeName(themeName: 'default' | 'dark') {
		this.themeName = themeName;
	}

	toggleSecondarySectionCollapse() {
		this.secondarySectionCollapsed = !this.secondarySectionCollapsed;
	}
}
