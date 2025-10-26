export interface RegisterInstance {
	name: 'registerInstance';
	tabId: number;
	instanceId: string;
	instanceType: 'popup' | 'devtools';
}

export interface UnregisterInstance {
	name: 'unregisterInstance';
	tabId: number;
	instanceId: string;
	instanceType: 'popup' | 'devtools';
}

export type RuntimeMessage = RegisterInstance | UnregisterInstance;
