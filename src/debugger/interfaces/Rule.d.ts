import {RequestMethod} from '@/debugger/constants/RequestMethod';
import {ResourceType} from '@/debugger/constants/ResourceType';
import {UrlCompareType} from '@/debugger/constants/UrlCompareType';
import {CancelReasons} from '@/debugger/constants/CancelReasons';
import {RequestBodyType} from '@/debugger/constants/RequestBodyType';

export interface Rule {
	id: string;
	filter: {
		url: {
			value: string | RegExp;
			compareType: UrlCompareType;
		};
		resourceTypes: ResourceType[];
		methods: RequestMethod[];
	};
	actions: {
		mutateRequest: {
			enabled: boolean;
			endpointReplace: string;
			headers: {
				add: {[s: string]: string;},
				remove: string[];
			},
			replaceBody: {
				type: RequestBodyType;
				value: null | string | Blob;
			};
		};
		mutateResponse: {
			enabled: boolean;
			responseLocally: boolean;
			statusCode: number | null;
			headers: {
				add: {[s: string]: string;},
				remove: string[];
			},
			replaceBody: {
				type: RequestBodyType;
				value: null | string | Blob;
			};
		};
		cancelRequest: {
			enabled: boolean;
			reason: CancelReasons;
		};
	}
}
