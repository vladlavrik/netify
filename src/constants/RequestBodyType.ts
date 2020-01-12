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

export const responseBodyTypesHumanTitles: Record<RequestBodyType, string> = {
	[RequestBodyType.Text]: 'Text',
	[RequestBodyType.UrlEncodedForm]: 'Url encoded form',
	[RequestBodyType.MultipartFromData]: 'Multipart from data',
};
