export enum RequestBodyType {
	Text = 'Text',
	Base64 = 'Base64',
	Blob = 'Blob',
}

export const requestBodyTypesList = [
	RequestBodyType.Text,
	RequestBodyType.Base64,
	// RequestBodyTypes.Blob, // TODO implement in future
];
