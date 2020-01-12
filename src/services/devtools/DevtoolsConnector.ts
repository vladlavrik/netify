export interface DevtoolsConnector {
	isAttached: boolean;

	sendCommand<TParams extends Record<string, any> = any, TResult = any>(
		command: string,
		params?: TParams,
	): Promise<TResult>;

	listenEvent<TParams extends Record<string, any> | void = void>(
		eventName: string,
		callback: (params: TParams) => void,
	): () => void; // Returns unsubscribe callback
}
