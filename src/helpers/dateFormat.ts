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

// TODO add comments
export function formatTime(date: Date) {
	const time = date.toLocaleString('en-US', timeOnlyDateFormat);
	const milliseconds = date
		.getMilliseconds()
		.toString()
		.padStart(3, '0');
	return `${time}.${milliseconds}`;
}

// TODO add comments
export function formatFullTime(date: Date) {
	return date.toLocaleString('en-US', fullDateFormat);
}
