import {observable, action} from 'mobx';
import {Rule} from '@/debugger/constants/Rule';
import {RootStore} from '@/components/App/RootStore';
import {UrlCompareTypes} from '@/debugger/constants/UrlCompareTypes';
import {RequestTypes} from '@/debugger/constants/RequestTypes';
import {RequestMethods} from '@/debugger/constants/RequestMethods';
import {RequestBodyTypes} from '@/debugger/constants/RequestBodyTypes';
import {CancelReasons} from '@/debugger/constants/CancelReasons';

export class RulesStore {
	constructor(_rootStore: RootStore) {}

	@observable
	readonly list: Rule[] = [
		{
			id: 0,
			filter: {
				url: {
					type: UrlCompareTypes.StartsWith,
					value: 'http://vlad-accounts.dev.ukr.net/api/v1/token/verification/acquire',
				},
				requestTypes: [RequestTypes.XHR, RequestTypes.Fetch],
				methods: [RequestMethods.GET, RequestMethods.POST],
			},
			mutateRequest: {
				enabled: true,
				endpointReplace:
					'https://hacker-server.anonim.com/youtube-stream?url=%protocol%//%hostname%:%port%%path%%query%',
				method: RequestMethods.POST,
				headersToAdd: {'X-my-header': 'secret-header'},
				headersToRemove: ['s-id'],
				replaceBody: {
					enabled: true,
					type: RequestBodyTypes.Text,
					value: 'new Body',
				},
			},
			mutateResponse: {
				enabled: true,
				responseLocally: false,
				statusCode: 200,
				headersToAdd: {'X-Sid': 'null'},
				headersToRemove: [],
				replaceBody: {
					enabled: true,
					type: RequestBodyTypes.Text,
					value: 'response body',
				},
			},
			responseError: {
				enabled: false,
				reason: CancelReasons.Aborted,
			},
		},
	];

	@action
	add(item: Rule) {
		this.list.push(item);
	}

	@action
	clearAll() {
		this.list.splice(0, this.list.length);
	}
}
