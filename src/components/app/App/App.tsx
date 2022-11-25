import React, {useMemo} from 'react';
import {createPortal} from 'react-dom';
import {observer} from 'mobx-react-lite';
import {Breakpoint} from '@/components/forms/breakpoint';
import {RuleCompose, RuleEditor} from '@/components/forms/rule';
import {Logs} from '@/components/logs';
import {Rules} from '@/components/rules';
import {RuleViewer} from '@/components/ruleViewer';
import {useStores} from '@/stores/useStores';
import {AppAttention} from '../AppAttention';
import {AppHeader} from '../AppHeader';
import {AppSections} from '../AppSections';
import styles from './app.css';

export const App = observer(() => {
	const {rulesStore, breakpointsStore} = useStores();
	const {composeShown} = rulesStore;
	const editorShown = !!rulesStore.editorShownFor;
	const detailsShown = !!rulesStore.detailsShownFor;
	const breakpointShown = breakpointsStore.hasBreakpoint;

	const modalTarget = useMemo(() => document.getElementById('modal-root')!, []);

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

			<AppAttention />

			{composeShown && createPortal(<RuleCompose />, modalTarget)}

			{editorShown && createPortal(<RuleEditor />, modalTarget)}

			{breakpointShown && createPortal(<Breakpoint />, modalTarget)}
		</div>
	);
});

App.displayName = 'App';
