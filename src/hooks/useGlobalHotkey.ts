import {useEffect} from 'react';

type HandlerFn = (event: KeyboardEvent) => void;

type HandlerInfo = [string, HandlerFn];
const handlersSet = new Set<HandlerInfo>();

const globalKeydownHandler = (event: KeyboardEvent) => {
	const handlers = Array.from(handlersSet).reverse();

	let prevented = false;
	for (const [key, handler] of handlers) {
		if (key === event.key) {
			handler(event);

			if (!prevented) {
				event.preventDefault();
				event.stopImmediatePropagation();
				prevented = true;
			}
		}
	}
};

/**
 * The Hook adds keydown  event listener to the document and calls a passed handler function is required key is pressed
 * @param requiredKey - required key code (KeyboardEvent.key)
 * @param handler - handler callback
 * @param active - pass false to temporary disable the hook
 */
export function useGlobalHotkey(requiredKey: string, handler?: HandlerFn, active = true) {
	useEffect(() => {
		if (!active || !handler) {
			return;
		}

		const handlerInfo: HandlerInfo = [requiredKey, handler];
		handlersSet.add(handlerInfo);

		if (handlersSet.size === 1) {
			document.addEventListener('keydown', globalKeydownHandler);
		}

		return () => {
			handlersSet.delete(handlerInfo);

			if (handlersSet.size === 0) {
				document.removeEventListener('keydown', globalKeydownHandler);
			}
		};
	}, [requiredKey, handler, active]);
}

useGlobalHotkey.displayName = 'useGlobalHotkey';
