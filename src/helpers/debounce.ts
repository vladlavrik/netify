/**
 * Creates a debounced function that delays invoking func until after wait milliseconds have elapsed since the last time the debounced function was invoked.
 * The debounced function comes with a `cancel` method to cancel delayed func invocations and a `flush` method to immediately invoke them.
 */
export function debounce<Args extends any[]>(fn: (...args: Args) => any, interval: number) {
	let pending: {args: Args; timeoutId: number} | undefined;

	function debounceTrigger(...args: Args) {
		if (pending) {
			clearTimeout(pending.timeoutId);
		}

		const timeoutId = window.setTimeout(() => {
			fn(...args);
			pending = undefined;
		}, interval);

		pending = {args, timeoutId};
	}

	debounceTrigger.cancel = () => {
		clearTimeout(pending?.timeoutId);
	};

	debounceTrigger.pending = () => {
		return !!pending;
	};

	debounceTrigger.flush = () => {
		if (pending) {
			clearTimeout(pending.timeoutId);
			fn(...pending.args);
		}
	};

	return debounceTrigger;
}
