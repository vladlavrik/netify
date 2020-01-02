import {attachDebugger, detachDebugger, listenDebuggerEvent, listenDebuggerDetach, setExtensionIcon} from './chrome/devtoolsAPI'; // prettier-ignore
import {FetchDomain} from './FetchDomain';

export enum DebuggerState {
	Active,
	Inactive,
	Starting,
	Stopping,
}

export interface DebuggerConfig {
	tabId: number;
	fetchDomain: FetchDomain;
	onUserDetach(): void; // When user manually destroy debugger by Chrome warning-panel
}

export class Debugger {
	private readonly debuggerVersion = '1.3';
	private readonly debugTarget: chrome.debugger.Debuggee & {tabId: number};
	private readonly fetchDomain: FetchDomain;
	private readonly listeners: {
		onUserDetach: DebuggerConfig['onUserDetach'];
	};

	private state = DebuggerState.Inactive;
	get currentState() {
		return this.state;
	}

	constructor({tabId, fetchDomain, onUserDetach}: DebuggerConfig) {
		this.debugTarget = {tabId};
		this.fetchDomain = fetchDomain;
		this.listeners = {onUserDetach};

		listenDebuggerDetach(this.detachHandler);
	}

	async initialize() {
		this.state = DebuggerState.Starting;

		await attachDebugger(this.debugTarget, this.debuggerVersion);
		await this.fetchDomain.enable();
		listenDebuggerEvent(this.messageHandler);

		this.state = DebuggerState.Active;
		setExtensionIcon(this.debugTarget.tabId, true, 'Netify (active)');
	}

	async destroy() {
		this.state = DebuggerState.Stopping;

		try {
			await this.fetchDomain.disable();
			await detachDebugger(this.debugTarget);
		} catch (error) {
			throw error;
		} finally {
			this.makeInactive();
		}
	}

	private detachHandler = (tabId: number | null) => {
		if (tabId === this.debugTarget.tabId && [DebuggerState.Active, DebuggerState.Starting].includes(this.state)) {
			this.makeInactive();
			this.listeners.onUserDetach();
		}
	};

	private makeInactive() {
		this.state = DebuggerState.Inactive;
		setExtensionIcon(this.debugTarget.tabId, false, 'Netify (inactive)');
	}

	private messageHandler = async (_source: any, method: string, params: any) => {
		if (method === 'Fetch.requestPaused') {
			await this.fetchDomain.process(params);
		}
	};
}
