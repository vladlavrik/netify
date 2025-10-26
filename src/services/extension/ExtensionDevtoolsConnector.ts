import {DevtoolsConnector, DevtoolsConnectorState} from '@/services/devtools';
import {EventBus} from '@/helpers/EventsBus';

type EventParams = Record<string, any>;
type EventCallback = (params: EventParams) => void;

export class ExtensionDevtoolsConnector implements DevtoolsConnector {
	readonly debuggerVersion = '1.3';
	readonly activeStateChangeEvent = new EventBus<DevtoolsConnectorState>();

	private readonly eventListeners: Record<string, EventCallback[]> = {};

	status: DevtoolsConnectorState = {type: 'disconnected'};

	constructor() {
		chrome.debugger.onDetach.addListener(this.detachHandler);
	}

	async connect(tabId: number) {
		this.log('connecting...');
		this.status = {type: 'connecting', tabId};
		this.activeStateChangeEvent.emit({...this.status});

		try {
			await chrome.debugger.attach({tabId}, this.debuggerVersion);
		} catch (error) {
			// Error can be due incorrectly terminated previous session and leaved debugger attached
			// Need to try detaching and attach one more time
			try {
				await chrome.debugger.detach({tabId});
				await chrome.debugger.attach({tabId}, this.debuggerVersion);
			} catch (_retryError) {
				throw error;
			}
		}

		this.log('connected');
		chrome.debugger.onEvent.addListener(this.eventHandler);
		this.status = {type: 'connected', tabId};
		this.activeStateChangeEvent.emit({...this.status});
	}

	async disconnect() {
		this.log('disconnecting...');
		const connectedTabId = this.status.type === 'connected' ? this.status.tabId : undefined;

		this.status = {type: 'disconnecting'};
		this.activeStateChangeEvent.emit({...this.status});

		if (connectedTabId) {
			try {
				await chrome.debugger.detach({tabId: connectedTabId});
			} catch (error) {
				console.error(error);
			}
		}

		chrome.debugger.onEvent.removeListener(this.eventHandler);
		this.log('disconnected');
		this.status = {type: 'disconnected'};
		this.activeStateChangeEvent.emit({...this.status});
	}

	async sendCommand<TParams extends Record<string, any> = any, TResult = any>(command: string, params?: TParams) {
		if (this.status.type !== 'connected') {
			throw new Error("ExtensionDevtoolsConnector: can't send command when devtools is not attached");
		}
		return chrome.debugger.sendCommand({tabId: this.status.tabId}, command, params) as Promise<TResult>;
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
		if ((this.status.type === 'connected' || this.status.type === 'connecting') && this.status.tabId === tabId) {
			this.status = {type: 'disconnected'};
			this.activeStateChangeEvent.emit({...this.status});
		}
	};

	private log(message: string, ...data: any[]) {
		console.info(`%cDevtools connector: ${message}`, 'color: #2b6e2c', ...data);
	}
}
