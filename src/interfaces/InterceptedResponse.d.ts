import {ResponseBodyType} from '@/constants/ResponseBodyType';

export interface InterceptedResponse {
	interceptionId: string;
	isResponse: true;
	statusCode: number;
	headers: {name: string; value: string}[];
	body: {
		type: ResponseBodyType;
		textValue: string;
		fileValue?: File;
	};
}
