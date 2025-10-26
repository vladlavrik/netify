import {useBooleanMediaQuery} from '@/hooks/useMediaQuery';

/**
 * Determines the app layout mode: vertical or horizontal panels positioning
 */
export const useAppLayoutMode = () => {
	return useBooleanMediaQuery('(width < 520px) or ((width < 700px) and (height >= 780px))')
		? 'vertical'
		: 'horizontal';
};
