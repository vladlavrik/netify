import {action, computed, observable} from 'mobx';
import {Breakpoint} from '@/interfaces/breakpoint';

export class BreakpointsStore {
	@observable
	accessor list: Breakpoint[] = [];

	@observable
	accessor activeBreakpointIndex = 0;

	@computed
	get hasBreakpoint() {
		return this.list.length !== 0;
	}

	@computed
	get activeBreakpoint() {
		return this.list[this.activeBreakpointIndex];
	}

	@action('addBreakpoint')
	addBreakpoint(breakpoint: Breakpoint) {
		this.list.push(breakpoint);
	}

	@action('setActiveBreakpointIndex')
	setActiveBreakpointIndex(index: number) {
		this.activeBreakpointIndex = index;
	}

	@action('removeBreakpoint')
	removeBreakpoint(breakpoint: Breakpoint) {
		const index = this.list.indexOf(breakpoint);
		if (index !== -1) {
			this.list.splice(index, 1);
		}

		if (index === this.activeBreakpointIndex) {
			this.activeBreakpointIndex = 0;
		}
	}

	@action('resetList')
	resetList() {
		this.list = [];
	}
}
