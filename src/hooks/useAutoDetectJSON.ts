import {useEffect} from 'react';

/**
 * Hook that auto-detects JSON content on initial load
 * @param currentType - The current body type (Text, JSON, etc.)
 * @param textValue - The current text value
 * @param textModeValue - The value that represents "Text" mode (e.g., RequestBodyType.Text)
 * @param onSuccess - Callback when valid JSON is detected, receives the parsed and prettified JSON
 * @param onError - Optional callback when JSON parsing fails
 */
export function useAutoDetectJSON(
	currentType: string,
	textValue: string,
	textModeValue: string,
	onSuccess: (prettifiedJSON: string) => void,
	onError?: () => void,
) {
	useEffect(() => {
		if (currentType !== textModeValue) {
			return;
		}

		if (!textValue) {
			return;
		}

		try {
			const parsed = JSON.parse(textValue);
			// Valid JSON detected, prettify and call success callback
			const prettified = JSON.stringify(parsed, null, 2);
			onSuccess(prettified);
		} catch {
			// Not valid JSON
			onError?.();
		}
	}, []);
}
