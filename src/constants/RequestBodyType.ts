export enum RequestBodyType {
	Original = 'Original',
	Text = 'Text',
	UrlEncodedForm = 'UrlEncodedForm',
	MultipartFromData = 'MultipartFromData',
}

export const requestBodyRealTypesList = [
	RequestBodyType.Text,
	RequestBodyType.UrlEncodedForm,
	RequestBodyType.MultipartFromData,
];

export const requestBodyTypesList = [RequestBodyType.Original, ...requestBodyRealTypesList];
