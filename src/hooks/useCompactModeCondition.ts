import {useBooleanMediaQuery} from '@/hooks/useMediaQuery';

/**
 * Compact mode is mean the second section (logs) is hidden
 */
export const useCompactModeCondition = () => useBooleanMediaQuery('(max-width: 520px)');
