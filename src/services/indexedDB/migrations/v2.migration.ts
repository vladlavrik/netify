import {RuleAction, Rule} from '@/interfaces/rule';
import {RequestBody, ResponseBody} from '@/interfaces/body';
import {ResourceType, resourceTypesList} from '@/constants/ResourceType';
import {RequestMethod, requestMethodsList} from '@/constants/RequestMethod';
import {RuleActionsType} from '@/constants/RuleActionsType';
import {ResponseErrorReason} from '@/constants/ResponseErrorReason';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
import {RequestBodyType} from '@/constants/RequestBodyType';

interface LegacyRequestBody {
	type: 'Original' | 'Text' | 'UrlEncodedForm' | 'MultipartFromData';
	textValue: string;
	formValue: {key: string; value: string}[];
}

interface LegacyResponseBody {
	type: 'Original' | 'Text' | 'Base64' | 'File';
	textValue: string;
	fileValue?: File;
}

interface LegacyRule {
	id: string;
	filter: {
		url: {
			value: string;
			compareType: string;
		};
		resourceTypes: ResourceType[];
		methods: RequestMethod[];
	};
	actions: {
		mutateRequest: {
			enabled: boolean;
			endpointReplace: string;
			methodReplace: RequestMethod;
			headers: {
				add: {[s: string]: string};
				remove: string[];
			};
			bodyReplace: LegacyRequestBody;
		};
		mutateResponse: {
			enabled: boolean;
			responseLocally: boolean;
			statusCode: number | null;
			headers: {
				add: {[s: string]: string};
				remove: string[];
			};
			bodyReplace: LegacyResponseBody;
		};
		cancelRequest: {
			enabled: boolean;
			reason: ResponseErrorReason;
		};
	};
}

function migrateSetHeaders(input: {[s: string]: string}) {
	return Object.entries(input).map(([name, value]) => ({name, value}));
}

function migrateRequestBody({type, textValue, formValue}: LegacyRequestBody): RequestBody | undefined {
	switch (type) {
		case 'Text':
			return {
				type: RequestBodyType.Text,
				value: textValue,
			};

		case 'UrlEncodedForm':
			return {
				type: RequestBodyType.UrlEncodedForm,
				value: formValue,
			};

		case 'MultipartFromData':
			return {
				type: RequestBodyType.MultipartFromData,
				value: formValue,
			};
	}

	return undefined;
}

function migrateResponseBody({type, textValue, fileValue}: LegacyResponseBody): ResponseBody | undefined {
	switch (type) {
		case 'Text':
			return {
				type: ResponseBodyType.Text,
				value: textValue,
			};

		case 'Base64':
			return {
				type: ResponseBodyType.Base64,
				value: textValue,
			};

		case 'File':
			if (fileValue) {
				return {
					type: ResponseBodyType.File,
					value: fileValue,
				};
			}
	}

	return undefined;
}

function migrateRule({id, filter, actions}: LegacyRule) {
	let action!: RuleAction;

	const {mutateRequest, mutateResponse, cancelRequest} = actions;

	if (cancelRequest.enabled) {
		action = {
			type: RuleActionsType.Failure,
			reason: cancelRequest.reason,
		};
	} else if (mutateResponse.enabled && mutateResponse.responseLocally) {
		action = {
			type: RuleActionsType.LocalResponse,
			statusCode: mutateResponse.statusCode || 200,
			headers: migrateSetHeaders(mutateResponse.headers.add),
			body: migrateResponseBody(mutateResponse.bodyReplace)!,
		};
	} else {
		action = {
			type: RuleActionsType.Mutation,
			request: {
				endpoint: mutateRequest.endpointReplace
					? mutateRequest.endpointReplace
							.replace('%protocol%', '[protocol]')
							.replace('%host%', '[host]')
							.replace('%hostname%', '[hostname]')
							.replace('%port%', '[port]')
							.replace('%path%', '[path]')
							.replace('%query%', '[query]')
					: undefined,
				method: mutateRequest.methodReplace,
				setHeaders: migrateSetHeaders(mutateRequest.headers.add),
				dropHeaders: mutateRequest.headers.remove,
				body: migrateRequestBody(mutateRequest.bodyReplace),
			},
			response: {
				statusCode: mutateResponse.statusCode || undefined,
				setHeaders: migrateSetHeaders(mutateResponse.headers.add),
				dropHeaders: mutateResponse.headers.remove,
				body: migrateResponseBody(mutateResponse.bodyReplace),
			},
		};
	}

	return {
		id,
		active: true,
		filter: {
			url: filter.url.value + (filter.url.value && filter.url.compareType === 'Starts with' ? '*' : ''),
			resourceTypes: filter.resourceTypes.filter(item => resourceTypesList.includes(item)),
			methods: filter.methods.filter(item => requestMethodsList.includes(item)),
		},
		action,
	};
}

export async function v2Migration(db: IDBDatabase, transaction: IDBTransaction) {
	const store = transaction.objectStore('rules');
	store.createIndex('origin', 'origin', {unique: false});
	store.deleteIndex('hostname');

	store.getAll().onsuccess = function() {
		for (const entry of this.result) {
			let rule: Rule;

			try {
				rule = migrateRule(entry.rule);
			} catch (error) {
				console.error(error);
				transaction.objectStore('rules').delete(entry.rule.id);
				continue;
			}

			transaction.objectStore('rules').put({
				timestamp: entry.timestamp,
				origin: entry.hostname,
				rule,
			});
		}
	};
}
