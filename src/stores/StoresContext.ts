import {createContext} from 'react';
import {RootStore} from './RootStore';

export const StoresContext = createContext<RootStore | null>(null);
