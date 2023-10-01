import type {
	SandboxExecuteRequestMessage,
	SandboxFromExecutorMessage,
	SandboxToExecutorMessage,
} from '../sandboxMessageProtocol';

export class SandboxExecutor {
	constructor() {
		window.addEventListener('message', (event) => this.handleMessage(event));
	}

	private handleMessage(event: MessageEvent) {
		const dataSource = event.data;
		if (!dataSource?.isSandboxMessage) {
			return;
		}

		const data = dataSource as SandboxToExecutorMessage;

		switch (data.type) {
			case 'executeRequest':
				this.executeCode(data);
				break;
		}
	}

	private postMessageToParent(message: SandboxFromExecutorMessage) {
		window.parent.postMessage(message, '*');
	}

	private async executeCode({requestId, code, async, scope}: SandboxExecuteRequestMessage) {
		// Register scope in global environment
		const globalScope = window as any;
		const scopeGlobalName = `__scope_${requestId}__`;
		globalScope[scopeGlobalName] = scope;

		// Provide access to the scope
		const executeCode = `(function(){const __scope__=window.${scopeGlobalName}; return (${code})})();`;

		// Execute
		let result;
		try {
			// eslint-disable-next-line no-eval
			result = async ? await eval(executeCode) : eval(executeCode);
		} catch (error) {
			console.error(error);
			this.postMessageToParent({
				isSandboxMessage: true,
				type: 'executeResult',
				requestId,
				success: false,
				error,
			});
			return;
		} finally {
			delete globalScope[scopeGlobalName];
		}

		this.postMessageToParent({
			isSandboxMessage: true,
			type: 'executeResult',
			requestId,
			success: true,
			result,
		});
	}
}
