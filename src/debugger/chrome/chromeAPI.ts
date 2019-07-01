export async function attachDebugger(target: chrome.debugger.Debuggee, debuggerVersion: string) {
	await new Promise((resolve, reject) => {
		chrome.debugger.attach(target, debuggerVersion, () => {
			if (chrome.runtime.lastError) {
				reject(new Error(chrome.runtime.lastError.message)); //TODO RuntimeError instance
			} else {
				resolve();
			}
		});
	});
}

export async function detachDebugger(target: chrome.debugger.Debuggee) {
	await new Promise((resolve, reject) => {
		chrome.debugger.detach(target, () => {
			if (chrome.runtime.lastError) {
				reject(new Error(chrome.runtime.lastError.message));
			} else {
				resolve();
			}
		});
	});
}

export async function sendDebuggerCommand<TResult = any>(
	target: chrome.debugger.Debuggee,
	command: string,
	params: object,
): Promise<TResult> {
	return await new Promise((resolve, reject) => {
		return chrome.debugger.sendCommand(target, command, params, (result: any) => {
			if (chrome.runtime.lastError) {
				reject(new Error(chrome.runtime.lastError.message));
			} else {
				resolve(result as TResult);
			}
		});
	});
}

export function listenDebuggerEvent(handler: (source: chrome.debugger.Debuggee, method: string, params: any) => void) {
	chrome.debugger.onEvent.addListener(handler);
}

export function listenDebuggerDetach(handler: (tabId: number | null) => void) {
	chrome.debugger.onDetach.addListener((source: chrome.debugger.Debuggee) => {
		return handler(source.tabId || null);
	});
}

export function setExtensionIcon(tabId: number, isActive: boolean | null, title: string | null) {
	if (isActive) {
		chrome.pageAction.show(tabId);
	} else if (isActive === false) {
		chrome.pageAction.hide(tabId);
	}

	if (title !== null) {
		chrome.pageAction.setTitle({tabId, title});
	}
}

export async function getTargetTabUrl() {
	const {tabId} = chrome.devtools.inspectedWindow;
	const {url}: {url?: string} = await new Promise(resolve => chrome.tabs.get(tabId, resolve));
	if (!url) {
		throw new Error("Can't get target tab url");
	}
	return url;
}
