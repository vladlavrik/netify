import {RequestMethod} from '@/constants/RequestMethod';
import {RequestBodyType} from '@/constants/RequestBodyType';

export interface InterceptedRequest {
	interceptionId: string;
	isRequest: true;
	endpoint: string;
	method: RequestMethod;
	headers: {name: string; value: string}[];
	body: {
		type: RequestBodyType;
		textValue: string;
		formValue: {key: string; value: string}[];
	};
}
