export function downloadFileFromString(fileContent: string, fileName: string, type = 'text/plain') {
	const file = new Blob([fileContent], {type});
	const url = URL.createObjectURL(file);

	const a = document.createElement('a');
	a.href = url;
	a.download = fileName || 'download';

	a.click();

	// Cleanup
	setTimeout(() => {
		URL.revokeObjectURL(url);
	}, 200);
}
