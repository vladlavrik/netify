import {RequestMethod} from '@/debugger/constants/RequestMethod';
import {ResourceType} from '@/debugger/constants/ResourceType';
import {UrlCompareType} from '@/debugger/constants/UrlCompareType';
import {CancelReasons} from '@/debugger/constants/CancelReasons';
import {RequestBodyType} from '@/debugger/constants/RequestBodyType';

export interface Rule {
	id: number;
	filter: {
		url: {
			compareType: UrlCompareType;
			value: string | RegExp;
		};
		resourceTypes: ResourceType[];
		methods: RequestMethod[];
	};
	actions: {
		mutateRequest: {
			enabled: boolean;
			endpointReplace: string;
			method: RequestMethod;
			headersToAdd: {[s: string]: string;}
			headersToRemove: string[];
			replaceBody: {
				enabled: boolean;
				type: RequestBodyType;
				value: string | Blob;
			};
		};
		mutateResponse: {
			enabled: boolean;
			responseLocally: boolean;
			statusCode: number | null;
			headersToAdd: {[s: string]: string;}
			headersToRemove: string[];
			replaceBody: {
				enabled: boolean;
				type: RequestBodyType;
				value: string | Blob;
			};
		};
		cancelRequest: {
			enabled: boolean;
			reason: CancelReasons;
		};
	}
}
