import {mixed} from 'yup';
import {RequestMethod, requestMethodsList} from '@/constants/RequestMethod';

export const requestMethodSchema = mixed<RequestMethod>().oneOf(requestMethodsList);
