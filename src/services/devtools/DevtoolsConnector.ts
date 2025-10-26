export type DevtoolsConnectorState =
	| {type: 'connected' | 'connecting'; tabId: number}
	| {type: 'disconnected' | 'disconnecting'};

export interface DevtoolsConnector {
	status: DevtoolsConnectorState;

	sendCommand<TParams extends Record<string, any> = any, TResult = any>(
		command: string,
		params?: TParams,
	): Promise<TResult>;

	listenEvent<TParams extends Record<string, any> | void = void>(
		eventName: string,
		callback: (params: TParams) => void,
	): () => void; // Returns unsubscribe callback
}
