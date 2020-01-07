import {useBooleanMedia} from '@/hooks/useMedia';

/**
 * Compact mode is mean the second section (logs) is hidden
 */
export const useCompactModeCondition = () => useBooleanMedia('(max-width: 520px)');
