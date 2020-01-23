import {v1Migration} from './v1.migration';
import {v2Migration} from './v2.migration';

export const migrations: ((db: IDBDatabase, transaction: IDBTransaction) => Promise<void>)[] = [
	v1Migration,
	v2Migration,
];
