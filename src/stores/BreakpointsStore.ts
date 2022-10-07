import {action, computed, makeObservable, observable} from 'mobx';
import {Breakpoint} from '@/interfaces/breakpoint';
import {RootStore} from './RootStore';

export class BreakpointsStore {
	list: Breakpoint[] = [];
	activeBreakpointIndex = 0;

	get hasBreakpoint() {
		return this.list.length !== 0;
	}

	get activeBreakpoint() {
		return this.list[this.activeBreakpointIndex];
	}

	constructor(private rootStore: RootStore) {
		makeObservable(this, {
			list: observable,
			activeBreakpointIndex: observable,
			hasBreakpoint: computed,
			activeBreakpoint: computed,
			addBreakpoint: action('addBreakpoint'),
			setActiveBreakpointIndex: action('setActiveBreakpointIndex'),
			removeBreakpoint: action('removeBreakpoint'),
			resetList: action('resetList'),
		});
	}

	addBreakpoint(breakpoint: Breakpoint) {
		this.list.push(breakpoint);
	}

	setActiveBreakpointIndex(index: number) {
		this.activeBreakpointIndex = index;
	}

	removeBreakpoint(breakpoint: Breakpoint) {
		const index = this.list.indexOf(breakpoint);
		if (index !== -1) {
			this.list.splice(index, 1);
		}

		if (index === this.activeBreakpointIndex) {
			this.activeBreakpointIndex = 0;
		}
	}

	resetList() {
		this.list = [];
	}
}
