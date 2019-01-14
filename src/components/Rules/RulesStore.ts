import {observable, action} from 'mobx';
import {Rule} from '@/debugger/interfaces/Rule';
import {RootStore} from '@/components/App/RootStore';
import {UrlCompareType} from '@/debugger/constants/UrlCompareType';
import {ResourceType} from '@/debugger/constants/ResourceType';
import {RequestMethod} from '@/debugger/constants/RequestMethod';
import {RequestBodyType} from '@/debugger/constants/RequestBodyType';
import {CancelReasons} from '@/debugger/constants/CancelReasons';

export class RulesStore {
	constructor(_rootStore: RootStore) {}

	@observable
	readonly list: Rule[] = [
		{
			id: 0,
			filter: {
				url: {
					compareType: UrlCompareType.StartsWith,
					value: 'http://vlad-accounts.dev.ukr.net/api/v1/token/verification/acquire',
				},
				resourceTypes: [ResourceType.XHR, ResourceType.Fetch],
				methods: [RequestMethod.GET, RequestMethod.POST],
			},
			actions: {
				mutateRequest: {
					enabled: true,
					endpointReplace:
						'https://hacker-server.anonim.com/youtube-stream?url=%protocol%//%hostname%:%port%%path%%query%',
					method: RequestMethod.POST,
					headersToAdd: {'X-my-header': 'secret-header'},
					headersToRemove: ['s-id'],
					replaceBody: {
						enabled: true,
						type: RequestBodyType.Text,
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
						type: RequestBodyType.Text,
						value: 'response body',
					},
				},
				cancelRequest: {
					enabled: false,
					reason: CancelReasons.Aborted,
				},
			}

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
