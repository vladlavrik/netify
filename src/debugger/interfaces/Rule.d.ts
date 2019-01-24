import {RequestMethod} from '@/debugger/constants/RequestMethod';
import {ResourceType} from '@/debugger/constants/ResourceType';
import {UrlCompareType} from '@/debugger/constants/UrlCompareType';
import {CancelReasons} from '@/debugger/constants/CancelReasons';
import {RequestBodyType} from '@/debugger/constants/RequestBodyType';
import {ResponseBodyType} from '@/debugger/constants/ResponseBodyType';

export interface Rule {
	id: string;
	filter: {
		url: {
			value: string;
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
				textValue: string;
				formValue: {key: string, value: string}[];
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
				type: ResponseBodyType;
				textValue: string;
				blobValue?: Blob;
			};
		};
		cancelRequest: {
			enabled: boolean;
			reason: CancelReasons;
		};
	}
}
