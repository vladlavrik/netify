import {RequestBodyType} from '@/constants/RequestBodyType';
import {ResponseBodyType} from '@/constants/ResponseBodyType';

export interface RequestBodyText {
	type: RequestBodyType.Text;
	value: string;
}

export interface RequestBodyForm {
	type: RequestBodyType.UrlEncodedForm | RequestBodyType.MultipartFromData;
	value: {key: string; value: string}[];
}

export type RequestBody = RequestBodyText | RequestBodyForm;

export interface ResponseBodyText {
	type: ResponseBodyType.Text | ResponseBodyType.Base64;
	value: string;
}

export interface ResponseBodyFile {
	type: ResponseBodyType.File;
	value: File;
}

export type ResponseBody = ResponseBodyText | ResponseBodyFile;
