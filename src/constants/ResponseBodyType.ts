export enum ResponseBodyType {
	Original = 'Original',
	Text = 'Text',
	Base64 = 'Base64',
	File = 'File',
}

export const responseBodyRealTypesList = [ResponseBodyType.Text, ResponseBodyType.Base64, ResponseBodyType.File];

export const responseBodyTypesList = [ResponseBodyType.Original, ...responseBodyRealTypesList];
