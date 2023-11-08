import React, {useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {RuleActionsType, ruleActionsTypeHumanTitles} from '@/constants/RuleActionsType';
import {useStores} from '@/stores/useStores';
import {RuleViewerActionBreakpoint} from '../RuleViewerActionBreakpoint';
import {RuleViewerActionFailure} from '../RuleViewerActionFailure';
import {RuleViewerActionLocalResponse} from '../RuleViewerActionLocalResponse';
import {RuleViewerActionMutation} from '../RuleViewerActionMutation';
import {RuleViewerFilter} from '../RuleViewerFilter';
import {RuleViewerHeader} from '../RuleViewerHeader';
import styles from './ruleViewer.css';

export const RuleViewer = observer(() => {
	const {rulesStore} = useStores();
	const rule = rulesStore.detailedRule;

	useEffect(() => {
		if (!rule) {
			rulesStore.closeDetails();
		}
	}, [rule]);

	if (!rule) {
		return null;
	}

	const {label, filter, action} = rule;

	const hasFilter = !!filter.url || filter.resourceTypes.length !== 0 || filter.methods.length !== 0;

	return (
		<div className={styles.root}>
			<RuleViewerHeader />

			<div className={styles.body}>
				{label && (
					<h2 className={styles.header}>
						<span className={styles.headerTitle}>{chrome.i18n.getMessage('label')}</span>
						<span className={styles.headerData}>{label}</span>
					</h2>
				)}

				<h2 className={styles.header}>
					<span className={styles.headerTitle}>
						{chrome.i18n.getMessage('filter')}
						{!hasFilter && ':'}
					</span>
					{!hasFilter && <span>{chrome.i18n.getMessage('allRequest')}</span>}
				</h2>
				{hasFilter && <RuleViewerFilter filter={filter} />}

				<h2 className={styles.header}>
					<span className={styles.headerTitle}>{chrome.i18n.getMessage('action')}</span>
					<span className={styles.headerData}>
						{chrome.i18n.getMessage(ruleActionsTypeHumanTitles[action.type])}
					</span>
				</h2>

				{action.type === RuleActionsType.Mutation && <RuleViewerActionMutation action={action} />}

				{action.type === RuleActionsType.Breakpoint && <RuleViewerActionBreakpoint action={action} />}

				{action.type === RuleActionsType.LocalResponse && <RuleViewerActionLocalResponse action={action} />}

				{action.type === RuleActionsType.Failure && <RuleViewerActionFailure action={action} />}
			</div>
		</div>
	);
});

RuleViewer.displayName = 'RuleViewer';
