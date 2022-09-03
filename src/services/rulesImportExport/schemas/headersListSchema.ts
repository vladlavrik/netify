import {z} from 'zod';

export const headersListSchema = z.array(
	z.object({
		name: z.string(),
		value: z.string(),
	}),
);
