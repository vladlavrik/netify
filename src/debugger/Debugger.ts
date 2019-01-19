import {
	mutateHeaders,
	bodyToString,
	compileRawResponseFromTextBody,
	compileRawResponseFromBase64Body,
	compileRawResponseFromBlobBody,
} from './helpers/http';
import {compileUrlFromPattern} from './helpers/url';
import {RulesManager} from './interfaces/RulesManager';
import {RequestBodyType} from './constants/RequestBodyType';
import {Log} from './interfaces/Log';
import {
	RequestEventParams,
	CompletedRequestEventParams,
	ContinueRequestParams,
	GetInterceptedBodyResponse,
} from './interfaces/chromeInternal';


//TODO work with redirects
//TODO work with forms (formdata/ multipart)

const interceptPatterns = [{
	urlPattern: '*',
	interceptionStage: 'Request',
}, {
	urlPattern: '*',
	interceptionStage: 'HeadersReceived',
}];


export enum DebuggerState {
	Active,
	Inactive,
	Starting,
	Stopping,
}

export interface DebuggerConfig {
	tabId: number,
	rulesManager: RulesManager,
	onRequestStart: (data: Log) => any;
	onRequestEnd: (id: Log['id']) => any;
}


//TODO replace request method
export default class Debugger {
	private readonly debuggerVersion = '1.3';

	private readonly debugTarget: {
		tabId: number
	};
	private rulesManager: RulesManager;
	private readonly onRequestStart: DebuggerConfig['onRequestStart'];
	private readonly onRequestEnd: DebuggerConfig['onRequestEnd'];

	state = DebuggerState.Inactive;

	constructor({tabId, rulesManager, onRequestStart, onRequestEnd}: DebuggerConfig) {
		this.debugTarget = {tabId};
		this.rulesManager = rulesManager;
		this.onRequestStart = onRequestStart;
		this.onRequestEnd = onRequestEnd;
	}

	async initialize() {
		this.state = DebuggerState.Starting;
		await this.attach();
		await this.sendCommand('Network.setRequestInterception', {patterns: interceptPatterns});
		chrome.debugger.onEvent.addListener(this.messageHandler);
		this.state = DebuggerState.Active;
	}

	private attach() {
		return new Promise((resolve, reject) => {
			chrome.debugger.attach(this.debugTarget, this.debuggerVersion, () => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				} else {
					resolve();
				}
			});
		});
	}

	public destroy() {
		this.state = DebuggerState.Stopping;

		return new Promise((resolve, reject) => {
			chrome.debugger.detach(this.debugTarget, () => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				} else {
					resolve();
				}
				this.state = DebuggerState.Inactive;
			});
		});
	}

	private sendCommand<TResult = any>(command: string, params: object): Promise<TResult> {
		return new Promise(resolve => {
			return chrome.debugger.sendCommand(this.debugTarget, command, params, (result: any) => {
				resolve(result as TResult);
			});
		});
	}

	private messageHandler = async (_source: any, method: string, params: any) => {
		if(method === 'Network.requestIntercepted') {
			if (params.hasOwnProperty('responseStatusCode')) {
				await this.handleServerResponse(params);
			} else {
				await this.handleClientRequest(params);
			}
		}
	};

	private async handleClientRequest({interceptionId, request, resourceType}: RequestEventParams) {
		const rule = this.rulesManager.selectOne({...request, resourceType});

		// skip if none rule for the request
		if (!rule) {
			await this.continueIntercepted({interceptionId});
			return;
		}

		// notify the owner about new request
		this.onRequestStart({
			id: interceptionId,
			ruleId: rule.id,
			loaded: false,
			date: new Date(),
			url: request.url,
			method: request.method,
			resourceType: request.resourceType,
		});

		const {mutateRequest, mutateResponse, cancelRequest} = rule.actions;


		// is defined response error and required local response, return error reason on the request stage
		if (cancelRequest.enabled) {
			await this.continueIntercepted({interceptionId, errorReason: cancelRequest.reason});
			this.onRequestEnd(interceptionId);
			return;
		}


		// if required local response, combine the response form defined status, headers and body
		if (mutateResponse.enabled && mutateResponse.responseLocally) {
			const {headers, replaceBody} = mutateResponse;
			const statusCode = mutateResponse.statusCode || 200;

			let rawResponse;
			switch (replaceBody.type) {
				case RequestBodyType.Text:
					rawResponse = compileRawResponseFromTextBody(statusCode, headers.add, <string>replaceBody.value);
					break;

				case RequestBodyType.Base64:
					rawResponse = compileRawResponseFromBase64Body(statusCode, headers.add, <string>replaceBody.value);
					break;

				case RequestBodyType.Blob:
					rawResponse = await compileRawResponseFromBlobBody(statusCode, headers.add, <Blob>replaceBody.value);
					break;
			}


			await this.continueIntercepted({interceptionId, rawResponse});
			this.onRequestEnd(interceptionId);
			return;
		}


		const continueParams: ContinueRequestParams = {interceptionId};

		if (!mutateRequest.enabled) {
			await this.continueIntercepted({interceptionId});
			return;
		}

		// rewrite request params before send to server
		// first, rewrite endpoint url
		if (mutateRequest.endpointReplace) {
			continueParams.url = compileUrlFromPattern(mutateRequest.endpointReplace, request.url);
		}

		// then, mutate headers
		if (Reflect.ownKeys(mutateRequest.headers.add).length || mutateRequest.headers.remove.length) {
			const {add, remove} = mutateRequest.headers;
			continueParams.headers = mutateHeaders(request.headers, add, remove);
		}

		// then, rewrite body
		if (mutateRequest.replaceBody.value !== null) {
			// TODO check opportunity of replace to form data or blob
			const {type, value} = mutateRequest.replaceBody;
			continueParams.postData = await bodyToString(type, value);
		}

		await this.continueIntercepted(continueParams);
	}

	private async handleServerResponse(
		{interceptionId, request, resourceType, responseHeaders, responseStatusCode}: CompletedRequestEventParams
	) {
		const rule = this.rulesManager.selectOne({...request, resourceType});

		// skip if none rule for the request
		if (!rule) {
			await this.continueIntercepted({interceptionId});
			this.onRequestEnd(interceptionId);
			return;
		}

		const {mutateResponse} = rule.actions;

		const skipHandler = mutateResponse.statusCode === null
			&& Reflect.ownKeys(mutateResponse.headers.add).length === 0
			&& mutateResponse.headers.remove.length === 0
			&& mutateResponse.replaceBody.value === null;

		if (!mutateResponse.enabled || skipHandler) {
			await this.continueIntercepted({interceptionId});
			this.onRequestEnd(interceptionId);
			return;
		}

		// define status code
		let newStatusCode = mutateResponse.statusCode === null
			? responseStatusCode
			: mutateResponse.statusCode;


		// defined mutated headers
		const newHeaders = mutateHeaders(
			responseHeaders,
			mutateResponse.headers.add,
			mutateResponse.headers.remove,
		);

		// TODO maybe handle response without full rebuild if body not changed

		// define response body from the rules or extract from the server response
		let newBodyType;
		let newBodyValue;
		if (mutateResponse.replaceBody.value !== null) {
			newBodyType = mutateResponse.replaceBody.type;
			newBodyValue = mutateResponse.replaceBody.value;
		} else {
			const {body, base64Encoded} = await this.sendCommand<GetInterceptedBodyResponse>(
				'Network.getResponseBodyForInterception',
				{interceptionId}
			);
			newBodyType = base64Encoded
				? RequestBodyType.Base64
				: RequestBodyType.Text;
			newBodyValue = await body;
		}

		// combine rawResponse from new body, old and new headers, and status code

		let rawResponse;
		switch (newBodyType) {
			case RequestBodyType.Text:
				rawResponse = compileRawResponseFromTextBody(newStatusCode, newHeaders, <string>newBodyValue);
				break;

			case RequestBodyType.Base64:
				rawResponse = compileRawResponseFromBase64Body(newStatusCode, newHeaders, <string>newBodyValue);
				break;

			case RequestBodyType.Blob:
				rawResponse = await compileRawResponseFromBlobBody(newStatusCode, newHeaders, <Blob>newBodyValue);
				break;
		}

		await this.continueIntercepted({interceptionId, rawResponse});
		this.onRequestEnd(interceptionId);
	}

	private async continueIntercepted(params: ContinueRequestParams, waitTime?: number) {
		const continueCommand = () => {
			return this.sendCommand('Network.continueInterceptedRequest', params).then( /* TODO check response */);
		};

		if (waitTime) {
			// TODO implement throttling
		} else {
			await continueCommand();
		}
	}
}
