import {Settings} from '@/interfaces/settings';

/**
 * User settings data mapper with data storing in extension local storage or in-memory as a fallback
 */
export class SettingsMapper {
	private fallbackStorage: Partial<Settings> = {};

	async getValue<K extends keyof Settings>(key: K) {
		try {
			const result = await chrome.storage.local.get(key);
			return result[key] as Settings[K];
		} catch (error) {
			console.error(error);
			return this.fallbackStorage[key] as Settings[K];
		}
	}

	async getValues<K extends keyof Settings>(keys: K[]) {
		try {
			return chrome.storage.local.get(keys) as Promise<Pick<Settings, K>>;
		} catch (error) {
			console.error(error);
			return keys.reduce<Record<string, any>>((map, key) => {
				map[key] = this.fallbackStorage[key];
				return map;
			}, {}) as Pick<Settings, K>;
		}
	}

	async setValue<K extends keyof Settings>(key: K, value: Settings[K]) {
		try {
			await chrome.storage.local.set({[key]: value});
		} catch (error) {
			console.error(error);
			this.fallbackStorage[key] = value;
		}
	}

	async setValues(values: Partial<Settings>) {
		try {
			await chrome.storage.local.set(values);
		} catch (error) {
			console.error(error);
			Object.assign(this.fallbackStorage, values);
		}
	}

	watch<K extends keyof Settings>(keys: K[], callback: (changed: Partial<Pick<Settings, K>>) => void) {
		const changeHandler = (changes: Record<string, chrome.storage.StorageChange>) => {
			const changedValues: Partial<Pick<Settings, K>> = {};

			for (const [key, values] of Object.entries(changes)) {
				if (keys.includes(key as K)) {
					changedValues[key as K] = values.newValue as Settings[K];
				}
			}

			if (Object.keys(changedValues).length !== 0) {
				callback(changedValues);
			}
		};

		chrome.storage.local.onChanged.addListener(changeHandler);

		return () => {
			chrome.storage.local.onChanged.removeListener(changeHandler);
		};
	}
}
