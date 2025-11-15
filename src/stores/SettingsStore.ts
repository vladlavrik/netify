import {action, observable} from 'mobx';
import {Settings} from '@/interfaces/settings';
import {SettingsMapper} from '@/services/settingsMapper';

type AppSettings = Pick<Settings, 'uiTheme' | 'filterRulesByOrigin'>;

const defaultValues: AppSettings = {uiTheme: 'system', filterRulesByOrigin: true};

export class SettingsStore {
	@observable
	accessor values: AppSettings = {...defaultValues};

	constructor(private readonly settingsMapper: SettingsMapper) {}

	async fetchValues() {
		const data = await this.settingsMapper.getValues(['uiTheme', 'filterRulesByOrigin']);

		const keys = Object.keys(data) as (keyof AppSettings)[];

		for (const key of keys) {
			const value = data[key];
			if (value !== undefined) {
				this.setValue(key, value);
			}
		}
	}

	watchChanges() {
		return this.settingsMapper.watch(
			['uiTheme', 'filterRulesByOrigin'],
			action('setChangeValue', (changes) => {
				Object.assign(this.values, changes);
			}),
		);
	}

	@action('setValue')
	private setValue<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
		this.values[key] = value;
	}

	@action('updateValues')
	updateValues(values: Partial<Settings>) {
		this.settingsMapper.setValues(values);
		Object.assign(this.values, values);
	}
}
