export interface SandboxMessage {
	isSandboxMessage: true;
	type: string;
}

export interface SandboxExecuteRequestMessage extends SandboxMessage {
	type: 'executeRequest';
	code: string;

	/** Run code and wait to promise resolve, "await" used */
	async?: boolean;

	/** Used to pass some data into the script */
	scope?: Record<string, any>;

	/** Unique id to match request and response*/
	requestId: number;
}

export type SandboxExecuteResultMessage = SandboxMessage & {
	type: 'executeResult';
	requestId: number;
} & (
		| {
				success: true;
				result: unknown;
		  }
		| {
				success: false;
				error: unknown;
		  }
	);

export type SandboxToExecutorMessage = SandboxExecuteRequestMessage;
export type SandboxFromExecutorMessage = SandboxExecuteResultMessage;
