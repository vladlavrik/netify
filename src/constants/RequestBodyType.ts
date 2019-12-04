export enum RequestBodyType {
	Text = 'Text',
	UrlEncodedForm = 'UrlEncodedForm',
	MultipartFromData = 'MultipartFromData',
}

export const requestBodyTypesList = [
	RequestBodyType.Text,
	RequestBodyType.UrlEncodedForm,
	RequestBodyType.MultipartFromData,
];
