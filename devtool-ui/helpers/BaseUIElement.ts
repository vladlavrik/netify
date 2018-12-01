import TemplateProvider from './TemplateProvider.js';
import StateProvider, {baseState, stateKey} from './StateProvider.js';

const toUpperCaseRegexp = /-([a-z])/g;
const toUpperCaseTransform = (s: string) => s[1].toUpperCase();

type eventDeclarationById = {
	id: string,
	event: string,
	handler: Function,
	options?: AddEventListenerOptions
}
type eventDeclarationByRoot = {
	root: boolean,
	event: string,
	handler: Function,
	options?: AddEventListenerOptions
}
type eventDeclaration = eventDeclarationByRoot|eventDeclarationById;

export default abstract class BaseUIElement<TState extends baseState = baseState> extends HTMLElement {
	// static methods
	public static htmlToTemplate(html: string): HTMLTemplateElement {
		const tpl = document.createElement('template');
		tpl.innerHTML = html;
		return tpl;
	};

	// rewritable by an extended element class
	protected static readonly template?: HTMLTemplateElement;
	protected readonly events: eventDeclaration[] = [];

	protected static readonly boundPropertiesToState: string[] = [];
	protected static readonly boundAttributesToState: string[] = [];

	protected readonly defaultState?: { [P in keyof TState]?: TState[P]; };

	// public
	public readonly state: TState;
	public get $ () {
		return this.templateProvider ? this.templateProvider.elementsWithId : {} as {[s: string]: Element};
	};

	// internal
	private templateProvider?: TemplateProvider;
	protected readonly stateProvider: StateProvider<TState>;

	protected constructor() {
		super();
		// provide state
		this.stateProvider = new StateProvider<TState>({notifier: this.notifyStateUpdate.bind(this)});
		this.state = this.stateProvider.state;

		// map defaults and initial attributes and properties to state
		Object.assign(this.state, this.defaultState);
		this.bindPropertiesState();
		for (const attribute of Array.from(this.attributes)) {
			this.bindAttributeToState(attribute.name, attribute.value);
		}
	}

	protected render({delegatesFocus}: {delegatesFocus?: boolean} = {}) {
		const shadowRoot = this.attachShadow({mode: 'open', delegatesFocus});
		const {template} = <typeof BaseUIElement>this.constructor;
		if (template) {
			const root = template.content.cloneNode(true);
			this.templateProvider = new TemplateProvider(root);
			this.templateProvider.compileWithState(this.state);
			shadowRoot.appendChild(root);
			this.listenEvents();
		}
	}

	private notifyStateUpdate(key: stateKey, oldValue: any, value: any) {
		if (this.templateProvider) {
			this.templateProvider.applyUpdate(key, value);
		}

		if (this.stateChangedCallback) {
			this.stateChangedCallback(key, oldValue, value);
		}
	}


	private listenEvents() {
		for (const eventInfo of this.events) {
			let element: Element;

			if (eventInfo.hasOwnProperty('root')) {
				element = this;
			} else {
				element = this.$[(eventInfo as eventDeclarationById).id];
			}

			if (!element) {
				continue;
			}

			element.addEventListener(eventInfo.event, eventInfo.handler.bind(this), eventInfo.options);
		}
	}

	private bindPropertiesState() {
		const {boundPropertiesToState} = <typeof BaseUIElement>this.constructor;

		const descriptions:PropertyDescriptorMap = {};
		for (const property of boundPropertiesToState) {
			descriptions[property] = {
				get: () => {
					return this.state[property]
				},
				set: (value) => {
					this.state[property] = value;
					return true;
				},
			};

			// define initial property value to state
			if (this.hasOwnProperty(property) && !this.state.hasOwnProperty(property)) {
				this.state[property] = (this as {[key: string]: any})[property];
			}
		}

		Object.defineProperties(this, descriptions);
	}

	public attributeChangedCallback(attrName: string, _oldValue: string|null, value: string|null) {
		this.bindAttributeToState(attrName, value);
	}

	private bindAttributeToState(attrName: string, value: string|null) {
		const {boundAttributesToState} = <typeof BaseUIElement>this.constructor;

		if (boundAttributesToState.includes(attrName)) {
			const propName = attrName.replace(toUpperCaseRegexp, toUpperCaseTransform);

			switch (value) {
				case null:
					this.state[propName] = undefined;
					break;

				case '':
				case attrName:
					this.state[propName] = true;
					break;

				default:
					this.state[propName] = value;
			}
		}
	}

	protected stateChangedCallback?(_keyPath: stateKey, _oldValue: any, _value: any): any
}
