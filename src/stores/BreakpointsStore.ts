import {action, computed, observable} from 'mobx';
import {RequestBreakpoint, ResponseBreakpoint} from '@/interfaces/breakpoint';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
import {Event} from '@/helpers/events';
import {pushNotification, notificationButtonClickEvent} from '@/helpers/notifications';
import {RootStore} from './RootStore';

type Breakpoint = RequestBreakpoint | ResponseBreakpoint;

export class BreakpointsStore {
	constructor(private rootStore: RootStore) {
		notificationButtonClickEvent.on(this.handleNotificationButtonClick.bind(this));
	}

	readonly executeRequestEvent = new Event<RequestBreakpoint>();
	readonly executeResponseEvent = new Event<ResponseBreakpoint>();
	readonly abortEvent = new Event<string>();

	@observable
	readonly breakpoints: Breakpoint[] = [];

	@computed
	get activeBreakpoint() {
		// Active breakpoint is oldest
		return this.breakpoints.length > 0 ? this.breakpoints[0] : undefined;
	}

	getByRequestId(requestId: string) {
		return this.breakpoints.find(item => item.requestId === requestId);
	}

	@action
	add(breakpoint: Breakpoint) {
		this.breakpoints.push(breakpoint);

		// Notify by the push if panes is not shown
		if (!this.rootStore.appStore.panelShown) {
			const isResponse = !!(breakpoint as ResponseBreakpoint).statusCode;
			pushNotification(
				`requestBreakpoint:${breakpoint.requestId}`,
				`Netify: breakpoint on ${isResponse ? 'request' : 'response'}`,
				'Url: ' + breakpoint.url,
				['Execute', 'Abort'],
			);
		}
	}

	@action
	execute(mutatedData: Breakpoint) {
		const breakpoint = this.breakpoints.find(item => item.requestId === mutatedData.requestId);

		if (!breakpoint) {
			// Todo show visual error;
			throw new Error('original breakpoint data not found');
		}

		this.remove(breakpoint);

		const isResponse = !!(mutatedData as ResponseBreakpoint).statusCode;
		if (isResponse) {
			this.executeResponseEvent.emit(mutatedData as ResponseBreakpoint);
		} else {
			this.executeRequestEvent.emit(mutatedData as RequestBreakpoint);
		}
	}

	@action
	localResponse(breakpoint: RequestBreakpoint) {
		// Add default response data
		Object.assign<RequestBreakpoint, Partial<ResponseBreakpoint>>(breakpoint, {
			statusCode: 200,
			headers: [{name: '', value: ''}],
			body: {
				type: ResponseBodyType.Text,
				textValue: '',
			},
		});
	}

	@action
	abort(breakpoint: Breakpoint) {
		this.remove(breakpoint);
		this.abortEvent.emit(breakpoint.requestId);
	}

	@action
	private remove(breakpoint: Breakpoint) {
		const index = this.breakpoints.indexOf(breakpoint);
		if (index !== -1) {
			this.breakpoints.splice(index, 1);
		}
	}

	private handleNotificationButtonClick(data: {notificationId: string; buttonIndex: number}) {
		const {notificationId, buttonIndex} = data;
		const [type, payload] = notificationId.split(':');
		if (type !== 'requestBreakpoint') {
			return;
		}

		const breakpoint = this.getByRequestId(payload);
		if (!breakpoint) {
			return;
		}

		switch (buttonIndex) {
			case 0:
				this.execute(breakpoint);
				break;
			case 1:
				this.abort(breakpoint);
				break;
		}
	}
}
