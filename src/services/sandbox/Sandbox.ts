import type {
	SandboxExecuteResultMessage,
	SandboxFromExecutorMessage,
	SandboxToExecutorMessage,
} from './sandboxMessageProtocol';

export class Sandbox {
	private requestIdScope = 0;
	private readonly pendingRequests: Record<
		number,
		{
			resolve(result: unknown): void;
			reject(error: unknown): void;
		}
	> = {};

	constructor(private sandboxIframe: HTMLIFrameElement) {
		window.addEventListener('message', (event) => this.handleMessage(event));
	}

	private handleMessage(event: MessageEvent) {
		const dataSource = event.data;
		if (!dataSource?.isSandboxMessage) {
			return;
		}

		const data = dataSource as SandboxFromExecutorMessage;

		switch (data.type) {
			case 'executeResult':
				this.handleExecuteResult(data);
				break;
		}
	}

	private postMessageToExecutor(message: SandboxToExecutorMessage) {
		this.sandboxIframe.contentWindow!.postMessage(message, '*');
	}

	/**
	 * @param code executable code, it must be returnable value
	 * @param async wait to promise resolve
	 * @param scope used to pass some data into the script, allowed to access inside a script by __scope__
	 */
	async execute<Result = unknown>(code: string, async = false, scope: Record<string, any>) {
		const requestId = this.requestIdScope++;

		return new Promise<Result>((resolve, reject) => {
			this.pendingRequests[requestId] = {resolve, reject};

			this.postMessageToExecutor({
				type: 'executeRequest',
				isSandboxMessage: true,
				code,
				async,
				scope,
				requestId,
			});
		});
	}

	private handleExecuteResult(data: SandboxExecuteResultMessage) {
		const request = this.pendingRequests[data.requestId];
		if (!request) {
			console.warn(`Sandbox: not request found by id ${data.requestId}`);
			return;
		}
		delete this.pendingRequests[data.requestId];

		if (data.success) {
			request.resolve(data.result);
		} else {
			request.reject(data.error);
		}
	}
}
