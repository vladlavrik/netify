export async function promisifyIDBRequest<TResult = any>(request: IDBRequest) {
	return new Promise<TResult>((resolve, reject) => {
		request.onsuccess = () => {
			resolve(request.result);
		};

		request.onerror = () => {
			reject(request.error);
		};
	});
}

export function generitiryIDBRequest(request: IDBRequest) {
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
						value: result,
					};
				},
			};
		},
	};
}
