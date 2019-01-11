import * as React from 'react';
import {observer, Provider} from 'mobx-react';
import {AppStore} from './AppStore';
import {Logs, LogsStore} from '../Logs';
import {Rules, RulesStore} from '../Rules';

@observer
export class App extends React.Component {
	private readonly appStore = new AppStore();
	private readonly rulesStore = new RulesStore();
	private readonly logsStore = new LogsStore();

	render() {
		return (
			<Provider
				appStore={this.appStore}
				rulesStore={this.rulesStore}
				logsStore={this.logsStore}>
				<div>
					<Rules/>
					<Logs/>
				</div>
			</Provider>
		);
	}
}

