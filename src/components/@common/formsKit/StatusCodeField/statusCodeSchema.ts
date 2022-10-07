import {number} from 'yup';

const statusCodeInvalidError = 'Invalid status code';

export const statusCodeSchema = number()
	.typeError(statusCodeInvalidError)
	.min(100, statusCodeInvalidError)
	.max(599, statusCodeInvalidError);
