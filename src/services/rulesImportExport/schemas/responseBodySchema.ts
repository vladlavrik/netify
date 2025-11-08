import {z} from 'zod';
import {ResponseBodyType} from '@/constants/ResponseBodyType';

export const responseBodySchema = z.union([
	z.object({
		type: z.union([z.literal(ResponseBodyType.Text), z.literal(ResponseBodyType.JSON), z.literal(ResponseBodyType.Base64)]),
		value: z.string(),
	}),
	z.object({
		type: z.literal(ResponseBodyType.File),
		value: z.instanceof(File).transform(async (file) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);

			const content = await new Promise<string>((resolve) => {
				reader.onloadend = () => {
					const base64data = reader.result as string;
					resolve(base64data || '');
				};
				reader.onerror = () => {
					resolve(btoa('<<FAILED FILE TO BASE64 TRANSFORMATION RESULT>>'));
				};
			});

			return {
				content,
				name: file.name,
			};
		}),
	}),
]);
