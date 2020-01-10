export enum ResourceType {
	XHR = 'XHR',
	Fetch = 'Fetch',
	Script = 'Script',
	Stylesheet = 'Stylesheet',
	Document = 'Document',
	Font = 'Font',
	Image = 'Image',
	Media = 'Media',

	// Temporary disabled because trigger exception when use with RequestPattern
	// Manifest = 'Manifest',
	// WebSocket = 'WebSocket',
}

export const resourceTypesList = [
	ResourceType.XHR,
	ResourceType.Fetch,
	ResourceType.Script,
	ResourceType.Stylesheet,
	ResourceType.Document,
	ResourceType.Font,
	ResourceType.Image,
	ResourceType.Media,
	// ResourceType.Manifest,
	// ResourceType.WebSocket,
];
