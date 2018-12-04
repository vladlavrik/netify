export enum RequestMethods {
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


export default [
	RequestMethods.XHR,
	RequestMethods.Fetch,
	RequestMethods.Script,
	RequestMethods.Stylesheet,
	RequestMethods.Document,
	RequestMethods.Font,
	RequestMethods.Image,
	RequestMethods.Media,
	RequestMethods.Manifest,
	RequestMethods.TextTrack,
	RequestMethods.EventSource,
	RequestMethods.WebSocket,
	RequestMethods.SignedExchange,
	RequestMethods.Ping,
	RequestMethods.CSPViolationReport,
	RequestMethods.Other,
]
