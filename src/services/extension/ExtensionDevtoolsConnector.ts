import {Event} from '@/helpers/Events';
import {DevtoolsConnector} from '@/services/devtools';

type EventParams = Record<string, any>;
type EventCallback = (params: EventParams) => void;

export class ExtensionDevtoolsConnector implements DevtoolsConnector {
	readonly debuggerVersion = '1.3';
	readonly userDetachEvent = new Event<void>();
	private readonly eventListeners: Record<string, EventCallback[]> = {};

	isAttached = false;

	constructor(private readonly tabId: number) {
		chrome.debugger.onDetach.addListener(this.detachHandler);
	}

	async initialize() {
		await new Promise<void>((resolve, reject) => {
			chrome.debugger.attach({tabId: this.tabId}, this.debuggerVersion, () => {
				if (chrome.runtime.lastError) {
					reject(new Error(chrome.runtime.lastError.message));
				} else {
					this.isAttached = true;
					chrome.debugger.onEvent.addListener(this.eventHandler);
					resolve();
				}
			});
		});
	}

	async destroy() {
		await new Promise<void>((resolve, reject) => {
			chrome.debugger.detach({tabId: this.tabId}, () => {
				if (chrome.runtime.lastError) {
					reject(new Error(chrome.runtime.lastError.message));
				} else {
					this.isAttached = false;
					chrome.debugger.onEvent.removeListener(this.eventHandler);
					resolve();
				}
			});
		});
	}

	async sendCommand<TParams extends Record<string, any> = any, TResult = any>(
		command: string,
		params?: TParams,
	): Promise<TResult> {
		return new Promise((resolve, reject) => {
			chrome.debugger.sendCommand({tabId: this.tabId}, command, params, (result: any) => {
				if (chrome.runtime.lastError) {
					reject(new Error(chrome.runtime.lastError.message));
				} else {
					resolve(result as TResult);
				}
			});
		});
	}

	listenEvent<TParams extends EventParams | void>(eventName: string, callback: (params: TParams) => void) {
		if (!this.eventListeners.hasOwnProperty(eventName)) {
			this.eventListeners[eventName] = [];
		}
		const eventListeners = this.eventListeners[eventName];

		eventListeners.push(callback as EventCallback);

		return () => {
			const index = eventListeners.indexOf(callback as EventCallback);
			eventListeners.splice(index, 1);
		};
	}

	private eventHandler = (_source: chrome.debugger.Debuggee, eventName: string, params: EventParams = {}) => {
		const eventListeners = this.eventListeners[eventName] || [];

		for (const listener of eventListeners) {
			listener(params);
		}
	};

	private detachHandler = ({tabId}: chrome.debugger.Debuggee) => {
		if (tabId === this.tabId) {
			this.isAttached = false;
			this.userDetachEvent.emit();
		}
	};
}
