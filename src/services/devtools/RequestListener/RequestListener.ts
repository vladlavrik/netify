import {Protocol} from 'devtools-protocol';
import type {DevtoolsConnector} from '@/services/devtools';
import {EventBus} from '@/helpers/EventsBus';

type EnableRequest = Protocol.Network.EnableRequest;
type RequestWillBeSentEvent = Protocol.Network.RequestWillBeSentEvent;

/**
 * The service provides all requests from the target tab listening
 */
export class RequestListener {
	readonly events = {
		requestProcessed: new EventBus<{a: string}>(),
	};

	private enabled = false;
	private unsubscribeDevtoolsEvents?: () => void;

	get isEnabled() {
		return this.enabled;
	}

	constructor(private readonly devtools: DevtoolsConnector) {}

	async enable() {
		this.enabled = true;

		await this.devtools.sendCommand<EnableRequest>('Network.enable', {maxPostDataSize: 0});

		this.unsubscribeDevtoolsEvents = this.devtools.listenEvent<RequestWillBeSentEvent>(
			'Network.requestWillBeSent',
			this.process.bind(this),
		);

		this.log('enabled');
	}

	async disable() {
		this.enabled = false;

		if (this.devtools.status.type === 'connected') {
			await this.devtools.sendCommand('Network.disable');
		}
		if (this.unsubscribeDevtoolsEvents) {
			this.unsubscribeDevtoolsEvents();
		}

		this.log('disabled');
	}

	async restart() {
		if (this.enabled) {
			await this.disable();
			await this.enable();
		}
	}

	private async process(event: RequestWillBeSentEvent) {
		// TODO
	}

	private log(message: string, ...data: any[]) {
		console.info(`%cRequest listener: ${message}`, 'color: #8c873b', ...data);
	}
}
