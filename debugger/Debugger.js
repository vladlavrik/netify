import {compileRawResponse, mutateHeaders} from './helpers/http.js'
import {compileUrlFromPattern} from './helpers/url.js'

const interceptPatterns = [{
	urlPattern: '*',
	interceptionStage: 'Request'
}, {
	urlPattern: '*',
	interceptionStage: 'HeadersReceived'
}];


export default class Debugger {
	debuggerVersion = '1.3';

	debugTarget = null;

	rulesList = [];

	constructor({tabId}) {
		this.debugTarget = {tabId}
	}

	async initialize() {
		await this.attach();
		await this.sendCommand('Network.setRequestInterception', {patterns: interceptPatterns});
		chrome.debugger.onEvent.addListener(this.messageHandler);
	}

	clearAllRules() {
		this.rulesList = [];
	}

	addRules(rules) {
		this.rulesList.push(rules)
	}

	removeRules(rules) {
		this.rulesList.push(rules)
	}

	attach() {
		return new Promise((resolve, reject) => {
			chrome.debugger.attach(this.debugTarget, this.debuggerVersion, () => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError);
				} else {
					resolve();
				}
			})
		});
	}

	sendCommand(command, params) {
		return new Promise(resolve => chrome.debugger.sendCommand(this.debugTarget, command, params, resolve));
	}

	messageHandler = (source, method, params) => {
		if(method === "Network.requestIntercepted") {
			if (params.hasOwnProperty('responseStatusCode')) {
				this.handleServerResponse(params);
			} else {
				this.handleClientRequest(params);
			}
		}
	};

	async handleClientRequest({interceptionId, request, resourceType}) {
		const actions = this.selectRuleActions({request, resourceType});

		// skip if none rule for the request
		if (!actions) {
			this.continueIntercepted(interceptionId);
			return;
		}

		// is defined response error and required local response, return error reason on the request stage
		if (actions.responseError.enabled && actions.responseError.locally) {
			this.continueIntercepted(interceptionId, {errorReason: actions.responseError.reason});
			return;
		}

		// if required local response, combine the response form defined status, headers and body
		if (actions.mutateResponse.enabled && actions.mutateResponse.responseLocally) {
			this.continueIntercepted(interceptionId, {
				rawResponse: await compileRawResponse(
					actions.mutateResponse.statusCode,
					actions.mutateResponse.headersToAdd,
					actions.mutateResponse.replaceBody.type,
					actions.mutateResponse.replaceBody.value,
				),
			});  // TODO add throttling
			return;
		}

		const requestRewriteParams = {};

		// rewrite request params before send to server
		// first, rewrite endpoint url
		if (actions.mutateRequest.endpointReplace) {
			requestRewriteParams.url = compileUrlFromPattern(actions.mutateRequest.endpointReplace, request.url);
		}

		// then, rewrite method
		if (actions.mutateRequest.method) {
			requestRewriteParams.method = actions.mutateRequest.method;
		}

		// then, mutate headers
		if (Reflect.ownKeys(actions.mutateRequest.headersToAdd).length || actions.mutateRequest.headersToRemove.length) {
			const {headersToAdd, headersToRemove} = actions.mutateRequest;
			requestRewriteParams.headers = mutateHeaders(request.headers, headersToAdd, headersToRemove);
		}

		// then, rewrite body
		if (actions.mutateRequest.replaceBody.enabled) {
			// TODO check opportunity of replace to form data or blob
			requestRewriteParams.postData = actions.mutateRequest.replaceBody.value;
		}

		this.continueIntercepted(interceptionId, requestRewriteParams);

		// TODO add throttle
	}

	async handleServerResponse({interceptionId, request, resourceType, responseHeaders, responseStatusCode}) {
		const actions = this.selectRuleActions({request, resourceType});

		// skip if none rule for the request
		if (!actions) {
			this.continueIntercepted(interceptionId);
			return;
		}

		// is defined an response error pass it
		if (actions.responseError.enabled) {
			this.continueIntercepted(interceptionId, {errorReason: actions.responseError.reason});
			return;
		}

		const skipHandler = actions.mutateResponse.statusCode === null &&
			Reflect.ownKeys(actions.mutateResponse.headersToAdd).length === 0 &&
			actions.mutateResponse.headersToRemove.length === 0 &&
			!actions.mutateResponse.replaceBody;

		if (skipHandler) {
			this.continueIntercepted(interceptionId); // TODO add throttling
		}

		// define status code
		let finallyStatusCode = actions.mutateResponse.statusCode === null
			? responseStatusCode
			: actions.mutateResponse.statusCode;


		// defined mutated headers
		const finallyHeaders = mutateHeaders(
			responseHeaders,
			actions.mutateResponse.headersToAdd,
			actions.mutateResponse.headersToRemove
		);

		// define response body from the rules or extract from the server response
		let finallyBodyType;
		let finallyBodyValue;
		if (actions.mutateResponse.replaceBody.enabled) {
			finallyBodyType = actions.mutateResponse.replaceBody.type;
			finallyBodyValue = actions.mutateResponse.replaceBody.value;
		} else {
			const {body, base64Encoded} = await this.sendCommand('Network.getResponseBodyForInterception', {interceptionId});
			finallyBodyType = base64Encoded ? 'base64' : 'text';
			finallyBodyValue = await body;
		}

		// combine rawResponse from new body, old and new headers, and status code
		this.continueIntercepted(interceptionId, {
			rawResponse: await compileRawResponse(
				finallyStatusCode,
				finallyHeaders,
				finallyBodyType,
				finallyBodyValue,
			),
		});

		// TODO add throttle
	}

	continueIntercepted(interceptionId, params, waitTime) {
		const continueCommand = () => {
			this.sendCommand('Network.continueInterceptedRequest', {
				interceptionId,
				...params,
			});
		};

		if (waitTime) {
			setTimeout(continueCommand, waitTime)
		} else {
			continueCommand();
		}
	}

	selectRuleActions({request, resourceType}) {
		const rules = this.rulesList.find(({filter}) => {
			if (filter.requestTypes.length && !filter.requestTypes.includes(resourceType)) {
				return false;
			}

			if (filter.methods.length && !filter.methods.includes(request.method)) {
				return false;
			}

			if (filter.url.type === 'Exact' && filter.url.value !== request.url) {
				return false;
			}

			if (filter.url.type === 'StartWith' && !request.url.startsWith(filter.url.value)) {
				return false;
			}

			if (filter.url.type === 'RegExp' && !filter.url.value.test(request.url)) {
				return false;
			}

			return true;
		});

		return rules ? rules.actions: null;
	}
}
