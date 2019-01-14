const timeOnlyDateFormat = {
	minute: '2-digit',
	second: '2-digit',
};

const fullDateFormat = {
	year: 'numeric',
	day: 'numeric',
	month: 'short',
	minute: '2-digit',
	second: '2-digit',
};

export function formatTime(date: Date) {
	const time = date.toLocaleString('en-US', timeOnlyDateFormat);
	const milliseconds = date
		.getMilliseconds()
		.toString()
		.padStart(3, '0');
	return `${time}.${milliseconds}`;
}

export function formatFullTime(date: Date) {
	return date.toLocaleString('en-US', fullDateFormat);
}
