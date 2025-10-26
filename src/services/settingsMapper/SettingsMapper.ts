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
}
