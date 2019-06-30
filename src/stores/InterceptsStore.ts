import {action, observable, computed, toJS} from 'mobx';
import {InterceptedRequest} from '@/interfaces/InterceptedRequest';
import {InterceptedResponse} from '@/interfaces/InterceptedResponse';
import {RootStore} from './RootStore';

type InterceptedRequestOrResponse = InterceptedRequest | InterceptedResponse;

export class InterceptsStore {
	constructor(_rootStore: RootStore) {}

	@observable
	readonly list: InterceptedRequestOrResponse[] = [];

	@observable
	activeInterceptedId: string | null = null;

	@computed
	get activeIntercepted() {
		const id = this.activeInterceptedId;
		return id ? this.list.find(item => item.interceptionId === id) : undefined;
	}

	@action
	add(intercepted: InterceptedRequestOrResponse) {
		const shouldShow = this.list.length === 0;

		this.list.push(intercepted);

		if (shouldShow) {
			this.activeInterceptedId = intercepted.interceptionId;
		}
	}

	@action
	private remove(intercepted: InterceptedRequestOrResponse) {
		const index = this.list.indexOf(intercepted);
		if (index !== -1) {
			this.list.splice(index, 1);
		}
	}

	@action
	execute(mutatedData: InterceptedRequestOrResponse) {
		const originalIntercepted = this.list.find(item => {
			return (
				item.interceptionId === mutatedData.interceptionId &&
				(item as InterceptedRequest).isRequest === (mutatedData as InterceptedRequest).isRequest
			);
		});

		if (!originalIntercepted) {
			// Todo show visual error;
			throw new Error('originalIntercepted not found');
		}

		console.log('execute', toJS(mutatedData), toJS(originalIntercepted));
		this.remove(originalIntercepted);
	}

	@action
	localResponse(intercepted: InterceptedRequest) {
		this.remove(intercepted);
		console.log('localResponse');
	}

	@action
	abort(intercepted: InterceptedRequestOrResponse) {
		this.remove(intercepted);
		console.log('abort');
	}
}
