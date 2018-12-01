import {baseState, stateKey} from './StateProvider.js';

//TODO type stateKey = string[]
const parseInjectableValueDelimiter = /(.*?)({([a-z0-9_.]+?)})/gi;
const injectValueDelimiter = /{([a-z0-9_.]+?)}/gi;

type observedCondition = {
	element: Element,
	conditionKey: string[]
	compare: observedValueCompareRule,
	placeholder: Comment,
	attached: boolean,
};

type observedInjection = {
	node: Text,
};

type observedAttribute = {
	element: Element,
	attrName: string,
};

type observedCSSClass = {
	element: Element,
	compare: observedValueCompareRule,
	className: string,
};

type observedValueCompareRule = {
	negative: boolean,
	findArrayValue?: string,
};

type observedEntriesTreeBranch = { //TODO - observed
	child: {[s: string]: observedEntriesTreeBranch},
	entries: {
		conditions: observedCondition[],
		injections: observedInjection[],
		attributes: observedAttribute[],
		CSSClasses: observedCSSClass[],
	}
};

const getEmptyObservedEntryBranch = () => ({
	child: {},
	entries: {
		conditions: [],
		injections: [],
		attributes: [],
		CSSClasses: [],
	}
});


export default class TemplateProvider {
	public readonly entriesTree: {[s: string]: observedEntriesTreeBranch} = {};

	public readonly elementsWithId: {[s: string]: Element} = {};

	constructor(root: Node) {
		this.indexTree(root);
	}

	private indexTree = (root: Node) => {
		for (const node of Array.from(root.childNodes)) {

			// handle injection into Text nodes
			if (node.nodeType === Node.TEXT_NODE) {
				const textNode = node as Text;
				const fullValue = textNode.nodeValue;
				if (!fullValue) {
					continue;
				}

				const newNodeFragment = document.createDocumentFragment();

				while (true) {
					const parsed = parseInjectableValueDelimiter.exec(fullValue);
					if (!parsed) {
						break;
					}

					const [, rawStrBefore, rawStr, keyStr] = parsed;

					if (rawStrBefore.length !== 0) {
						newNodeFragment.appendChild(document.createTextNode(rawStrBefore));
					}

					const tplTextNode = document.createTextNode(rawStr);
					newNodeFragment.appendChild(tplTextNode);

					const key = keyStr.split('.');
					this.getEntryBranch(key).entries.injections.push({node: tplTextNode});
				}

				// replace initial text node with collection of raw and injectable text nodes
				if (newNodeFragment.hasChildNodes()) {
					(textNode as any).replaceWith(newNodeFragment) // ts workaround
				}

				injectValueDelimiter.lastIndex = 0;

				continue;
			}

			// skip everyone other except Element node
			if (node.nodeType !== Node.ELEMENT_NODE) {
				continue;
			}
			const element = node as Element;

			// create reference to the element if it has an id attribute
			const elementId = element.id;
			if (elementId) {
				this.elementsWithId[elementId] = element;
			}

			for (const attr of Array.from((<Element>node).attributes)) {
				// handle conditions
				if(attr.name === '$if') {
					const {condition, compare} = this.parseCompareRule(attr.value);
					const conditionKey = condition.split('.');
					const entry: observedCondition = {
						conditionKey,
						compare,
						element,
						placeholder: document.createComment('element-placeholder'),
						attached: true,
					};

					this.getEntryBranch(conditionKey).entries.conditions.push(entry);

					element.removeAttribute('$if');
					continue;
				}

				// handle class injection
				if (attr.name.startsWith('$classif.')) {
					const {condition, compare} = this.parseCompareRule(attr.value);
					const conditionKey = condition.split('.');
					const entry: observedCSSClass = {
						element,
						className: attr.name.substr(9),
						compare,
					};

					this.getEntryBranch(conditionKey).entries.CSSClasses.push(entry);

					element.removeAttribute(attr.name);
					continue;
				}

				// handle attributes injection
				if (attr.name[0] === '$') {
					const conditionKey = attr.value.split('.');
					const entry: observedAttribute = {
						element,
						attrName: attr.name.substr(1),
					};

					this.getEntryBranch(conditionKey).entries.attributes.push(entry);

					element.removeAttribute(attr.name);
				}
			}

			this.indexTree(element);
		}
	};

	private getEntryBranch(key: stateKey): observedEntriesTreeBranch {
		// upset root branch
		const [keyRoot, ...keyRest] = key;
		if (!this.entriesTree.hasOwnProperty(keyRoot)) {
			this.entriesTree[keyRoot] = getEmptyObservedEntryBranch();
		}

		// upset all children tree
		let branch = this.entriesTree[keyRoot];
		for (const keyItem of keyRest) {
			branch = branch.child[keyItem] || getEmptyObservedEntryBranch();
		}

		return branch;
	}

	/**
	 * Supported syntax:
	 *  !<value> - not value
	 *  <value> includes <some item> - <some item> string value includes in <value> array
	 *  !<value> includes <some item> - the same as below but opposite value
	 */
	private parseCompareRule(value: string): {condition: string, compare: observedValueCompareRule} {
		let [condition, findArrayValue] = value.split(' includes ');
		let negative = false;

		if (condition[0] === '!') {
			condition = condition.substr(1);
			negative = true;
		}

		return {
			condition,
			compare: {negative, findArrayValue}
		}
	}

	public compileWithState(state: baseState) {
		for (const [stateKey, branch] of Object.entries(this.entriesTree)) {
			this.applyDeepUpdateByBranch(branch, state[stateKey]);
		}
	}

	public applyUpdate(key: stateKey, stateValue: any) {
		// check has any entry branch depends of the key
		const [keyRoot, ...keyRest] = key;
		let targetBranch = this.entriesTree[keyRoot];
		if (!targetBranch) {
			return;
		}

		for (const keyItem of keyRest) {
			targetBranch = targetBranch.child[keyItem];
			if (!targetBranch) {
				return;
			}
		}

		this.applyDeepUpdateByBranch(targetBranch, stateValue);
	}

	private applyDeepUpdateByBranch(branch: observedEntriesTreeBranch, stateValue: any) {
		// update current branch entries
		this.provideTemplateConditions(branch.entries.conditions, stateValue);
		this.provideTemplateInjections(branch.entries.injections, stateValue);
		this.provideTemplateAttributes(branch.entries.attributes, stateValue);
		this.provideTemplateCSSClasses(branch.entries.CSSClasses, stateValue);

		// call update entries of subtree branches
		for (const [stateKey, childBranch] of Object.entries(branch.child)) {
			const childStateValue = stateValue ? stateValue[stateKey] : undefined; // safe getting children
			this.applyDeepUpdateByBranch(childBranch, childStateValue)
		}
	}

	private provideTemplateConditions(entries: observedCondition[], value: any) {
		for (const entry of entries) {
			const attach = this.compareValueByRule(value, entry.compare);

			if (attach === entry.attached) { // no changes
				continue;
			}

			if (attach) {
				const parent = entry.placeholder.parentNode;
				if (parent && entry.placeholder) {
					parent.insertBefore(entry.element, entry.placeholder);
					entry.placeholder.remove();
				}
			} else {
				const parent = entry.element.parentNode;
				if (parent) {
					entry.placeholder = document.createComment('element-placeholder');
					parent.insertBefore(entry.placeholder, entry.element);
					entry.element.remove();
				}
			}

			entry.attached = attach;
		}
	}

	private provideTemplateInjections(entries: observedInjection[], value: any) {
		const strValue = [null, undefined].includes(value) ? '' : value;
		for (const entry of entries) {
			entry.node.nodeValue = strValue;
		}
	}

	private provideTemplateAttributes(entries: observedAttribute[], value: any) {
		for (const entry of entries) {
			switch (value) {
				case true:
					entry.element.setAttribute(entry.attrName, entry.attrName);
					break;

				case false:
				case null:
				case undefined:
					entry.element.removeAttribute(entry.attrName);
					break;

				default:
					entry.element.setAttribute(entry.attrName, value);
			}
		}
	}

	private provideTemplateCSSClasses(entries: observedCSSClass[], value: any) {
		for (const entry of entries) {
			const apply = this.compareValueByRule(value, entry.compare);
			if (apply) {
				entry.element.classList.add(entry.className);
			} else {
				entry.element.classList.remove(entry.className);
			}
		}
	}

	private compareValueByRule(value: any, compare: observedValueCompareRule): boolean {
		let result = value;

		if (compare.findArrayValue && Array.isArray(value)) {
			result = (value as string[]).includes(compare.findArrayValue);
		}

		if (compare.negative) {
			result = !result;
		}

		return !!result;
	}






}
