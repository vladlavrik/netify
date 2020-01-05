import React, {memo, useMemo} from 'react';
import {createPortal} from 'react-dom';
import {useStore} from 'effector-react';
import {$ruleComposeShown, $ruleEditorShown} from '@/stores/uiStore';
import {Logs} from '@/components/logs';
import {Rules} from '@/components/rules';
import {RuleCompose, RuleEditor} from '@/components/forms/rule';
import {AppSections} from '../AppSections';
import styles from './app.css';

export const App = memo(() => {
	const composeShown = useStore($ruleComposeShown);
	const editorShown = useStore($ruleEditorShown);

	const modalTarget = useMemo(() => document.getElementById('modal-root')!, []);

	return (
		<div className={styles.root}>
			<AppSections mainSection={<Rules />} secondarySection={<Logs />} />

			{composeShown && createPortal(<RuleCompose />, modalTarget)}

			{editorShown && createPortal(<RuleEditor />, modalTarget)}
		</div>
	);
});

App.displayName = 'App';
