import {action, observable} from 'mobx';

export class DebuggerStateStore {
	/** If the debugging is allowed by a user */
	@observable
	accessor enabled = true;

	/** If the debugging is active now, may differ at the moment of sw Itching and when the rules list is empty */
	@observable
	accessor active = false;

	/** Active state is switching */
	@observable
	accessor switching = false;

	@action('setEnabled')
	setEnabled(enabled: boolean) {
		this.enabled = enabled;
	}

	@action('toggleEnabled')
	toggleEnabled() {
		this.enabled = !this.enabled;
	}

	@action('setActive')
	setActive(active: boolean) {
		this.active = active;
	}

	@action('setSwitching')
	setSwitching(switching: boolean) {
		this.switching = switching;
	}
}
