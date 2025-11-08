export enum RequestBodyType {
	Text = 'Text',
	JSON = 'JSON',
	UrlEncodedForm = 'UrlEncodedForm',
	MultipartFromData = 'MultipartFromData',
}

export const requestBodyTypesList = [
	RequestBodyType.Text,
	RequestBodyType.JSON,
	RequestBodyType.UrlEncodedForm,
	RequestBodyType.MultipartFromData,
];

export const responseBodyTypesHumanTitles: Record<RequestBodyType, string> = {
	[RequestBodyType.Text]: 'Text',
	[RequestBodyType.JSON]: 'JSON',
	[RequestBodyType.UrlEncodedForm]: 'Url encoded form',
	[RequestBodyType.MultipartFromData]: 'Multipart from data',
};
