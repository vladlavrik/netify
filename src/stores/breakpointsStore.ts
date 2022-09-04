import {createStore, createEffect, createEvent, merge} from 'effector';
import {Breakpoint} from '@/interfaces/breakpoint';
import {Event} from '@/helpers/Events';
import {pushNotification} from '@/helpers/notifications';
import {$panelShown} from './uiStore';
import {ResponseBodyType} from '@/constants/ResponseBodyType';

export const executeOnBreakpointEvent = new Event<{requestId: string; data?: Breakpoint}>();
export const abortOnBreakpointEvent = new Event<{requestId: string}>();

export const addBreakpoint = createEffect('add breakpoint', {
	async handler(breakpoint: Breakpoint) {
		if (!$panelShown.getState()) {
			const isRequest = breakpoint.stage === 'Request';
			pushNotification(
				`requestBreakpoint:${breakpoint.requestId}`,
				`Netify: breakpoint on ${isRequest ? 'request' : 'response'}`,
				`Url: ${breakpoint.url}`,
				['Execute', 'Abort'],
			);
		}
	},
});

export const executeOnBreakpoint = createEffect('execute request on breakpoint', {
	handler: executeOnBreakpointEvent.emit,
});

export const abortOnBreakpoint = createEffect('abort request on breakpoint', {
	handler: abortOnBreakpointEvent.emit,
});

export const sendLocalResponse = createEvent<{requestId: string}>('sendLocalResponse');

export const $breakpoints = createStore<Breakpoint[]>([]);

$breakpoints.on(addBreakpoint.done, (list, {params}) => [...list, params]);

$breakpoints.on(merge([executeOnBreakpoint.done, abortOnBreakpoint.done]), (list, {params}) => {
	return list.filter(item => item.requestId !== params.requestId);
});

$breakpoints.on(sendLocalResponse, (list, {requestId}) => {
	const index = list.findIndex(item => item.requestId === requestId);
	if (index === -1) {
		return list;
	}

	const newList = list.slice();
	newList.splice(index, 1, {
		stage: 'Response',
		requestId,
		url: list[index].url,
		statusCode: 200,
		headers: [],
		body: {
			type: ResponseBodyType.Text,
			value: '',
		},
	});

	return newList;
});
