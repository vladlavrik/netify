import {action, makeObservable, observable} from 'mobx';

export class DebuggerStateStore {
	/** If the debugging is allowed by user */
	enabled = true;

	/** If the debugging is active now, may differ at the moment of sw Itching and when the rules list is empty */
	active = false;

	/** Active state is switching */
	switching = false;

	constructor() {
		makeObservable(this, {
			enabled: observable,
			active: observable,
			switching: observable,
			setEnabled: action('setEnabled'),
			toggleEnabled: action('toggleEnabled'),
			setActive: action('setActive'),
			setSwitching: action('setSwitching'),
		});
	}

	setEnabled(enabled: boolean) {
		this.enabled = enabled;
	}

	toggleEnabled() {
		this.enabled = !this.enabled;
	}

	setActive(active: boolean) {
		this.active = active;
	}

	setSwitching(switching: boolean) {
		this.switching = switching;
	}
}
