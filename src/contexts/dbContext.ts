import {createContext} from 'react';
import {RulesMapper} from '@/services/indexedDB';

interface DbContextValue {
	dbRulesMapper: RulesMapper;

}

export const DbContext = createContext<DbContextValue | null>(null);
