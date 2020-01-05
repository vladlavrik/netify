import {v1Migration} from './v1.migration';
import {v2Migration} from './v2.migration';

export const migrations: Record<number, (db: IDBDatabase) => Promise<void>> = {
	1: v1Migration,
	2: v2Migration,
};
