export function randomHex(length: number) {
	const array = new Uint8Array(length / 2);
	self.crypto.getRandomValues(array);

	return Array.from(array)
		.map((byte) => byte.toString(16).padStart(2, '0')) // 8byte integer to 2char hex
		.join('');
}
