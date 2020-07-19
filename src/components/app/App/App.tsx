import React, {memo, useMemo} from 'react';
import {createPortal} from 'react-dom';
import {useStore} from 'effector-react';
import {$ruleComposeShown, $ruleEditorShownFor, $ruleDetailsShownFor} from '@/stores/uiStore';
import {Logs} from '@/components/logs';
import {Rules} from '@/components/rules';
import {RuleViewer} from '@/components/ruleViewer';
import {RuleCompose, RuleEditor} from '@/components/forms/rule';
import {BreakpointRequest, BreakpointResponse} from '@/components/forms/breakpoint';
import {AppHeader} from '../AppHeader';
import {AppSections} from '../AppSections';
import styles from './app.css';

export const App = memo(function App() {
	const composeShown = useStore($ruleComposeShown);
	const editorShown = !!useStore($ruleEditorShownFor);
	const detailsShown = !!useStore($ruleDetailsShownFor);

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

			{composeShown && createPortal(<RuleCompose />, modalTarget)}

			{editorShown && createPortal(<RuleEditor />, modalTarget)}

			{editorShown && createPortal(<BreakpointRequest />, modalTarget)}
		</div>
	);
});
