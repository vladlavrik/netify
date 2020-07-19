import {Breakpoint} from '@/interfaces/breakpoint';
import {pushNotification, subscribeNotificationClick} from '@/helpers/notifications';
import {executeOnBreakpoint, abortOnBreakpoint} from '@/stores/breakpointsStore';

const notificationGroup = 'requestBreakpoint';

export class BreakpointNotifications {
	constructor() {
		subscribeNotificationClick(BreakpointNotifications.handleClick);
	}

	push(breakpoint: Breakpoint) {
		const isRequest = breakpoint.stage === 'Request';
		pushNotification(
			`${notificationGroup}:${breakpoint.requestId}`,
			`Netify: breakpoint on ${isRequest ? 'request' : 'response'}`,
			'Url: ' + breakpoint.url,
			['Execute', 'Abort'],
		);
	}

	private static handleClick(notificationId: string, buttonIndex: number) {
		const [group, requestId] = notificationId.split(':');
		if (group !== notificationGroup) {
			return;
		}

		switch (buttonIndex) {
			case 0:
				executeOnBreakpoint({requestId});
				break;

			case 1:
				abortOnBreakpoint({requestId});
				break;
		}
	}
}
