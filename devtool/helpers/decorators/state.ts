import {LitElement} from "@polymer/lit-element";

const initialDataKey = Symbol('stateStoreKey');
type initialDataStore = {[s: string]: any};

export default function () {
	return function(proto: Object, prop: string): any {
		const Component = proto.constructor as typeof LitElement;

		const getInitialData = (element: LitElement) => {
			if (!element.hasOwnProperty(initialDataKey)) {
				(element as any)[initialDataKey] = {} as initialDataStore;
			}

			return (element as any)[initialDataKey] as initialDataStore
		};

		Reflect.defineProperty(Component.prototype, prop, {
			get() {
				return getInitialData(this as LitElement)[prop];
			},
			set(value: any) {
				const initialData = getInitialData(this as LitElement);
				const oldValue = initialData[prop];
				initialData[prop] = value;
				(this as LitElement).requestUpdate(prop, oldValue);
				return true;
			},
			configurable: true,
			enumerable: true,
		});
	};
}
