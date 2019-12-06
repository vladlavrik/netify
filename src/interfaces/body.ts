import {RequestBodyType} from '@/constants/RequestBodyType';
import {ResponseBodyType} from '@/constants/ResponseBodyType';

export interface RequestBody {
	type: RequestBodyType;
	textValue: string;
	formValue: {key: string; value: string}[];
}

export interface ResponseBody {
	type: ResponseBodyType;
	textValue: string;
	fileValue?: File;
}
