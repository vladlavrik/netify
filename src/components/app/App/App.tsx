import React from 'react';
import {observer} from 'mobx-react-lite';
import {useStores} from '@/stores/useStores';
import {Logs} from '@/components/logs';
import {Rules} from '@/components/rules';
import {RuleViewer} from '@/components/ruleViewer';
import {AppHeader} from '../AppHeader';
import {AppPopups} from '../AppPopups';
import {AppSections} from '../AppSections';
import styles from './app.css';

export const App = observer(() => {
	const {rulesStore} = useStores();
	const detailsShown = !!rulesStore.detailsShownFor;

	return (
		<div className={styles.root}>
			<div className={styles.header}>
				<AppHeader />
			</div>
			<div className={styles.content}>
				<AppSections
					mainSection={<Rules />}
					secondarySection={<Logs />}
					floatingSection={detailsShown ? <RuleViewer /> : null}
				/>
			</div>

			<AppPopups />
		</div>
	);
});

App.displayName = 'App';
