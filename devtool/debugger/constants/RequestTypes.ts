export enum RequestTypes {
	XHR = 'XHR',
	Fetch = 'Fetch',
	Script = 'Script',
	Stylesheet = 'Stylesheet',
	Document = 'Document',
	Font = 'Font',
	Image = 'Image',
	Media = 'Media',
	Manifest = 'Manifest',
	TextTrack = 'TextTrack',
	EventSource = 'EventSource',
	WebSocket = 'WebSocket',
	SignedExchange = 'SignedExchange',
	Ping = 'Ping',
	CSPViolationReport = 'CSPViolationReport',
	Other = 'Other',
	//TODO check is it all
}


export const requestTypesList = [
	RequestTypes.XHR,
	RequestTypes.Fetch,
	RequestTypes.Script,
	RequestTypes.Stylesheet,
	RequestTypes.Document,
	RequestTypes.Font,
	RequestTypes.Image,
	RequestTypes.Media,
	RequestTypes.Manifest,
	RequestTypes.TextTrack,
	RequestTypes.EventSource,
	RequestTypes.WebSocket,
	RequestTypes.SignedExchange,
	RequestTypes.Ping,
	RequestTypes.CSPViolationReport,
	RequestTypes.Other,
];
