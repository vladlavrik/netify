export type stateKeyItem = string;
export type stateKey = stateKeyItem[];
export type baseState = {[s: string]: any};
type notifierFn = (key: stateKey, oldValue: any, value: any) => void;

// mep with to get a full key by a value object
const keysMap = new WeakMap<baseState, stateKey>();


export default class StateProvider<TState extends baseState = baseState> {
	private readonly _state: TState = {} as TState;
	public readonly state: TState;

	private readonly proxyHandler: ProxyHandler<TState>;

	private readonly notifier?: notifierFn;

	constructor(options: {notifier?: notifierFn} = {}) {
		this.notifier = options.notifier;

		this.proxyHandler = {
			set: this.setter.bind(this),
		};

		this.state = new Proxy<TState>(this._state, this.proxyHandler);
	}

	setter (target: TState, key: string, value: any) {
		const oldValue = (target as {[s: string]: any})[key];
		if (oldValue === value) {
			return true;
		}

		// extract the path to the current target, path will empty for the root object of state
		const targetKey = keysMap.get(target) || [];
		const valueKey = [...targetKey, key];

		target[key] = this.observeValueChildren(value, valueKey);

		if (this.notifier) {
			this.notifier(valueKey, oldValue, value);
		}

		return true;
	}

	observeValueChildren(value: any, path: string[]) {
		// non object values return as is
		if (typeof value !== 'object' || value === null) {
			return value;
		}
		value = value as {[s: string]: any};

		// recursive walk by by children values and replace each sub object to Proxy object
		for (const [key, subValue] of Object.entries(value)) {
			value[key] = this.observeValueChildren(subValue, [...path, key]);
		}

		// remember path to the value-object
		keysMap.set(value, path);

		// replace object value with proxy
		return new Proxy(value, this.proxyHandler);
	}
}
