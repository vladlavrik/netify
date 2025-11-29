import React, {useMemo} from 'react';
import {createPortal} from 'react-dom';
import {observer} from 'mobx-react-lite';
import {useStores} from '@/stores/useStores';
import {Breakpoint} from '@/components/forms/breakpoint';
import {RuleCompose, RuleEditor} from '@/components/forms/rule';

export const AppPopups = observer(() => {
	const {rulesStore, breakpointsStore} = useStores();
	const ruleCompose = rulesStore.compose;
	const ruleEditor = rulesStore.editor;
	const breakpointShown = breakpointsStore.hasBreakpoint;

	const modalTarget = useMemo(() => document.getElementById('modal-root')!, []);

	return (
		<>
			{ruleCompose.shown && createPortal(<RuleCompose initialData={ruleCompose.initialData} />, modalTarget)}

			{ruleEditor.shown && createPortal(<RuleEditor />, modalTarget)}

			{breakpointShown && createPortal(<Breakpoint />, modalTarget)}
		</>
	);
});

AppPopups.displayName = 'App';
