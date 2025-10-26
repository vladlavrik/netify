export function isUIColorThemeDark(settings: 'system' | 'light' | 'dark') {
	if (settings === 'system') {
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	}
	return settings === 'dark';
}
