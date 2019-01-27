import {RequestMethod} from '@/constants/RequestMethod';
import {ResourceType} from '@/constants/ResourceType';
import {UrlCompareType} from '@/constants/UrlCompareType';
import {CancelReasons} from '@/constants/CancelReasons';
import {RequestBodyType} from '@/constants/RequestBodyType';
import {ResponseBodyType} from '@/constants/ResponseBodyType';

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
			methodReplace: RequestMethod;
			headers: {
				add: {[s: string]: string};
				remove: string[];
			};
			bodyReplace: {
				type: RequestBodyType;
				textValue: string;
				formValue: {key: string; value: string}[];
			};
		};
		mutateResponse: {
			enabled: boolean;
			responseLocally: boolean;
			statusCode: number | null;
			headers: {
				add: {[s: string]: string};
				remove: string[];
			};
			bodyReplace: {
				type: ResponseBodyType;
				textValue: string;
				blobValue?: Blob;
			};
		};
		cancelRequest: {
			enabled: boolean;
			reason: CancelReasons;
		};
	};
}
