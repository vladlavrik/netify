import {action, observable} from 'mobx';
import {Settings} from '@/interfaces/settings';
import {SettingsMapper} from '@/services/settingsMapper';

export class SettingsStore implements Pick<Settings, 'uiTheme'> {
	@observable
	accessor uiTheme: Settings['uiTheme'] = 'system';

	constructor(private readonly settingsMapper: SettingsMapper) {}

	async fetchValues() {
		const data = await this.settingsMapper.getValues(['uiTheme']);

		if (data.uiTheme) {
			this.uiTheme = data.uiTheme;
		}
	}

	@action('setUITheme')
	setUITheme(themeName: Settings['uiTheme']) {
		this.uiTheme = themeName;
		this.settingsMapper.setValue('uiTheme', themeName);
	}
}
