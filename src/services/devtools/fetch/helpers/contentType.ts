import {RequestBodyType} from '@/constants/RequestBodyType';
import {ResponseBodyType} from '@/constants/ResponseBodyType';

function checkTextLikeContentType(domainContentType: string) {
	const [mainType, subType] = domainContentType.split('/');

	if (mainType === 'text') {
		return true;
	}

	if (mainType === 'application' && ['json', 'javascript', 'xml', 'xhtml+xml'].includes(subType)) {
		return true;
	}

	return false;
}

/** Can detect urlencoded or multipart forms and text-like types */
export function extractRequestContentType(contentType: string) {
	const domainType = contentType.split(';')[0].trim().toLowerCase();

	if (domainType === 'application/x-www-form-urlencoded') {
		return RequestBodyType.UrlEncodedForm;
	}

	if (domainType === 'multipart/form-data') {
		return RequestBodyType.MultipartFromData;
	}

	if (checkTextLikeContentType(domainType)) {
		return RequestBodyType.Text;
	}

	return undefined;
}

/** Can be detected only text-like type other is unknown */
export function extractResponseContentType(contentType: string) {
	const domainType = contentType.split(';')[0].trim().toLowerCase();

	if (checkTextLikeContentType(domainType)) {
		return ResponseBodyType.Text;
	}

	return undefined;
}
