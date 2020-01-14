import {createContext} from 'react';
import {RulesMapper} from '@/services/indexedDB';

interface DbContextValue {
	rulesMapper: RulesMapper;
}

export const DbContext = createContext<DbContextValue | null>(null);
