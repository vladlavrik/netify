import {RequestBodyType} from '@/constants/RequestBodyType';
import {ResponseBodyType} from '@/constants/ResponseBodyType';

interface RequestBodyText {
	type: RequestBodyType.Text;
	value: string;
}

interface RequestBodyForm {
	type: RequestBodyType.UrlEncodedForm | RequestBodyType.MultipartFromData;
	value: {key: string; value: string}[];
}

export type RequestBody = RequestBodyText | RequestBodyForm

interface ResponseBodyText {
	type: ResponseBodyType.Text | ResponseBodyType.Base64;
	value: string;
}

interface ResponseFileForm {
	type: ResponseBodyType.File;
	value?: File
}

export type ResponseBody = ResponseBodyText | ResponseFileForm
