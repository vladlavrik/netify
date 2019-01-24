export enum RequestBodyType {
	Original = 'Original',
	Text = 'Text',
	UrlEncodedForm = 'UrlEncodedForm',
	MultipartFromData = 'MultipartFromData',
}

export const requestBodyTypesList = [
	RequestBodyType.Original,
	RequestBodyType.Text,
	RequestBodyType.UrlEncodedForm,
	RequestBodyType.MultipartFromData,
];
