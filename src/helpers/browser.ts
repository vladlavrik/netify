// Source is https://github.com/ChromeDevTools/devtools-frontend/blob/ac799a524fcf9c4421679cd1934e9a8d8a9fce69/front_end/host/InspectorFrontendHost.js#L59
export function getPlatform() {
	const ua = navigator.userAgent;

	if (ua.match(/Windows NT/)) {
		return 'windows';
	}

	if (ua.match(/Mac OS X/)) {
		return 'mac';
	}

	return 'linux';
}
