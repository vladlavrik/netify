import {useContext} from 'react';
import {StoresContext} from './StoresContext';

export function useStores() {
	const rootStore = useContext(StoresContext);
	if (!rootStore) {
		throw new Error('useStore: no stores context provided');
	}
	return rootStore;
}
