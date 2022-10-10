import {action, computed, makeObservable, observable} from 'mobx';

export class AttentionsStore {
	list: string[] = [];

	get currentMessage() {
		return this.list.length !== 0 ? this.list[0] : null;
	}

	constructor() {
		makeObservable(this, {
			list: observable,
			currentMessage: computed,
			push: action('push'),
			cleanCurrent: action('cleanCurrent'),
		});
	}

	push(message: string) {
		this.list.unshift(message);
	}

	cleanCurrent() {
		this.list.shift();
	}
}
