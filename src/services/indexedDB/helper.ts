export async function promisifyIDBRequest<T>(request: IDBRequest<T>) {
	return new Promise<T>((resolve, reject) => {
		request.onsuccess = () => {
			resolve(request.result);
		};

		request.onerror = () => {
			reject(request.error);
		};
	});
}

export function generetifyIDBRequest<T extends {continue(): void} | null | undefined>(request: IDBRequest<T>) {
	return {
		[Symbol.asyncIterator]() {
			return {
				async next() {
					const result = await promisifyIDBRequest(request);
					if (!result) {
						return {
							done: true,
							value: null,
						};
					}

					result.continue();

					return {
						done: !result,
						value: result as T,
					};
				},
			};
		},
	};
}
