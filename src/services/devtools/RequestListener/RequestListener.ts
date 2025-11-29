import {Protocol} from 'devtools-protocol';
import {RequestMethod} from '@/constants/RequestMethod';
import {NetworkLogEntry} from '@/interfaces/networkLog';
import type {DevtoolsConnector} from '@/services/devtools';
import {EventBus} from '@/helpers/EventsBus';

type EnableRequest = Protocol.Network.EnableRequest;
type RequestWillBeSentEvent = Protocol.Network.RequestWillBeSentEvent;
type ResponseReceivedEvent = Protocol.Network.ResponseReceivedEvent;
type LoadingFailedEvent = Protocol.Network.LoadingFailedEvent;
type GetFrameTreeResponse = Protocol.Page.GetFrameTreeResponse;
type FrameTree = Protocol.Page.FrameTree;

/**
 * The service provides all requests from the target tab listening
 */
export class RequestListener {
	readonly events = {
		requestsInitialized: new EventBus<NetworkLogEntry>(),

		/** Attention: can emit requests from other tabs */
		requestsFinished: new EventBus<
			| {success: true; requestId: string; responseStatusCode: number}
			| {success: false; requestId: string; errorText: string}
		>(),
	};

	private enabled = false;
	private unsubscribeDevtoolsEvents?: () => void;

	/** IDs of the frames that are currently in the target tab
	 * Chrome emits network request events for each connected to devtools tabs,
	 * so it is necessary to filter out requests from other tabs */
	private currentFrameIds: string[] = [];

	get isEnabled() {
		return this.enabled;
	}

	constructor(private readonly devtools: DevtoolsConnector) {}

	async enable() {
		this.enabled = true;

		await this.devtools.sendCommand<EnableRequest>('Network.enable', {maxPostDataSize: 0});

		const unsubscribeRequestEvent = this.devtools.listenEvent<RequestWillBeSentEvent>(
			'Network.requestWillBeSent',
			this.processRequestWillBeSend.bind(this),
		);

		const unsubscribeResponseEvent = this.devtools.listenEvent<ResponseReceivedEvent>(
			'Network.responseReceived',
			this.processResponseReceived.bind(this),
		);

		const unsubscribeFailureEvent = this.devtools.listenEvent<LoadingFailedEvent>(
			'Network.loadingFailed',
			this.processResponseFailed.bind(this),
		);

		this.unsubscribeDevtoolsEvents = () => {
			unsubscribeRequestEvent();
			unsubscribeResponseEvent();
			unsubscribeFailureEvent();
		};

		this.readPageFrameIds();

		this.log('enabled');
	}

	async disable() {
		this.enabled = false;

		if (this.unsubscribeDevtoolsEvents) {
			this.unsubscribeDevtoolsEvents();
			this.unsubscribeDevtoolsEvents = undefined;
		}

		if (this.devtools.status.type === 'connected') {
			await this.devtools.sendCommand('Network.disable');
		}

		this.currentFrameIds = [];

		this.log('disabled');
	}

	private async readPageFrameIds() {
		const {frameTree} = await this.devtools.sendCommand<any, GetFrameTreeResponse>('Page.getFrameTree');
		this.currentFrameIds = this.getChildIframeIds(frameTree);
	}

	private getChildIframeIds(frameTree: FrameTree): string[] {
		const frameId = frameTree.frame.id;
		if (frameTree.childFrames?.length) {
			return [frameId, ...frameTree.childFrames.map((item) => this.getChildIframeIds(item)).flat()];
		}
		return [frameId];
	}

	private async processRequestWillBeSend(event: RequestWillBeSentEvent) {
		if (!event.frameId || !this.currentFrameIds.includes(event.frameId)) {
			return;
		}

		const {requestId, request, type: resourceType = 'Other'} = event;

		this.events.requestsInitialized.emit({
			requestId,
			timestamp: Date.now(),
			resourceType,
			method: request.method as RequestMethod,
			url: request.url,
		});
	}

	private async processResponseReceived(event: ResponseReceivedEvent) {
		if (!event.frameId || !this.currentFrameIds.includes(event.frameId)) {
			return;
		}

		const {requestId, response} = event;

		this.events.requestsFinished.emit({
			success: true,
			requestId,
			responseStatusCode: response.status,
		});
	}

	private async processResponseFailed(event: LoadingFailedEvent) {
		const {requestId, errorText} = event;

		this.events.requestsFinished.emit({
			success: false,
			requestId,
			errorText,
		});
	}

	private log(message: string, ...data: any[]) {
		console.info(`%cRequest listener: ${message}`, 'color: #8c873b', ...data);
	}
}
