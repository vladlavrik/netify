import {RequestMethods} from './RequestMethods'
import {RequestTypes} from './RequestTypes'
import {UrlFilterTypes} from './UrlFilterTypes'
import {ErrorReasons} from './ErrorReasons'
import {RequestBodyTypes} from './RequestBodyTypes'

export interface Rule {
	id: number,
	filter: {
		url: {
			type: UrlFilterTypes,
			value: string | RegExp,
		},
		requestTypes: RequestTypes[],
		methods: RequestMethods[],
	},
	mutateRequest: {
		enabled: boolean,
		endpointReplace: string,
		method: RequestMethods,
		headersToAdd: {[s: string]: string;}
		headersToRemove: string[],
		replaceBody: {
			enabled: boolean,
			type: RequestBodyTypes,
			value: string | Blob,
		},
	},
	mutateResponse: {
		enabled: boolean,
		responseLocally: boolean,
		statusCode: number|null,
		headersToAdd: {[s: string]: string;}
		headersToRemove: string[],
		replaceBody: {
			enabled: boolean,
			type: RequestBodyTypes,
			value: string | Blob,
		},
	},
	responseError: {
		enabled: boolean,
		locally: boolean,
		reason: ErrorReasons,
	},
}


