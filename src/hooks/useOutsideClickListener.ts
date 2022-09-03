import {RefObject, useCallback, useEffect, useMemo} from 'react';

/**
 * In hook is active it is listen document click event and
 * when it triggers, a handler  will be called if clicked element is not inside of the target
 * @param targets - the handler will be invoked only if a clicked element is not equal with one of this element
 * @param handler - handler callback
 * @param active - listener is active
 */
export function useOutsideClickListener(targets: RefObject<Element>[], handler?: () => void, active = true) {
	const topElement = useMemo(() => document.body, []);

	// TODO optimize
	const handlerClick = useCallback(
		(event: MouseEvent) => {
			let currentTarget = event.target as Element | null;
			const targetNodes = targets.map((target) => target.current!);

			while (currentTarget !== topElement && currentTarget) {
				if (targetNodes.includes(currentTarget)) {
					return;
				}

				currentTarget = currentTarget.parentElement || null;
			}

			if (handler) {
				handler();
			}
		},
		[handler],
	);

	useEffect(() => {
		if (!active) {
			return;
		}

		document.addEventListener('click', handlerClick);

		return () => {
			document.removeEventListener('click', handlerClick);
		};
	}, [active, handlerClick]);
}
