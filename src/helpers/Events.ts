export type Listener<T> = (event: T) => any;

export class Event<T> {
	private listeners: Listener<T>[] = [];

	on(listener: Listener<T>): () => void /* Unsubscribe function*/ {
		this.listeners.push(listener);
		return () => this.off(listener);
	}

	off(listener: Listener<T>) {
		const callbackIndex = this.listeners.indexOf(listener);
		if (callbackIndex !== -1) {
			this.listeners.splice(callbackIndex, 1);
		}
	}

	emit = (event: T) => {
		this.listeners.forEach(listener => listener(event));
	};
}
