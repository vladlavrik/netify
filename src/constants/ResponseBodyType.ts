export enum ResponseBodyType {
	Text = 'Text',
	Base64 = 'Base64',
	File = 'File', // TODO to BLOB
}

export const responseBodyTypesList = [
	//
	ResponseBodyType.Text,
	ResponseBodyType.Base64,
	ResponseBodyType.File,
];

export const responseBodyTypesHumanTitles: Record<ResponseBodyType, string> = {
	[ResponseBodyType.Text]: 'text',
	[ResponseBodyType.Base64]: 'base64',
	[ResponseBodyType.File]: 'file',
};
