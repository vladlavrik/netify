import {UrlCompareType} from '@/constants/UrlCompareType';
import {ResourceType} from '@/constants/ResourceType';
import {RequestMethod} from '@/constants/RequestMethod';
import {RequestBodyType} from '@/constants/RequestBodyType';
import {ResponseBodyType} from '@/constants/ResponseBodyType';
import {CancelReasons} from '@/constants/CancelReasons';

export interface FormValue {
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
			methodReplace?: RequestMethod;
			headers: {name: string; value: string}[];
			bodyReplace: {
				type: RequestBodyType;
				textValue: string;
				formValue: {key: string; value: string}[];
			};
		};
		mutateResponse: {
			enabled: boolean;
			responseLocally: '0' | '1';
			statusCode: string;
			headers: {name: string; value: string}[];
			bodyReplace: {
				type: ResponseBodyType;
				textValue: string;
				fileValue?: File;
			};
		};
		cancelRequest: {
			enabled: boolean;
			reason: CancelReasons;
		};
	};
}
