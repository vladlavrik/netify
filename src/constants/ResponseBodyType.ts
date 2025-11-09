export enum ResponseBodyType {
	Text = 'Text',
	JSON = 'JSON',
	Base64 = 'Base64',
	File = 'File',
}

export const responseBodyTypesList = [
	//
	ResponseBodyType.Text,
	ResponseBodyType.JSON,
	ResponseBodyType.Base64,
	ResponseBodyType.File,
];

export const responseBodyTypesHumanTitles: Record<ResponseBodyType, string> = {
	[ResponseBodyType.Text]: 'Text',
	[ResponseBodyType.JSON]: 'JSON',
	[ResponseBodyType.Base64]: 'Base 64',
	[ResponseBodyType.File]: 'File',
};
