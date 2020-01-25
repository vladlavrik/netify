import React, {memo, useEffect} from 'react';
import {useStore, useStoreMap} from 'effector-react';
import {RuleActionsType, ruleActionsTypeHumanTitles} from '@/constants/RuleActionsType';
import {$ruleDetailsShownFor, hideRuleDetails} from '@/stores/uiStore';
import {$rules} from '@/stores/rulesStore';
import {RuleViewerHeader} from '../RuleViewerHeader';
import {RuleViewerFilter} from '../RuleViewerFilter';
import {RuleViewerActionFailure} from '../RuleViewerActionFailure';
import {RuleViewerActionLocalResponse} from '../RuleViewerActionLocalResponse';
import {RuleViewerActionMutation} from '../RuleViewerActionMutation';
import styles from './ruleViewer.css';

export const RuleViewer = memo(function RuleViewer() {
	const ruleId = useStore($ruleDetailsShownFor);

	const rule = useStoreMap({
		store: $rules,
		keys: [ruleId],
		fn: (rules, [currentRuleId]) => rules.find(({id}) => id === currentRuleId) || null,
	});

	useEffect(() => {
		if (!rule) {
			hideRuleDetails();
		}
	}, [rule]);

	if (!ruleId || !rule) {
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
						<span className={styles.headerTitle}>Label:</span>
						<span className={styles.headerData}>{label}</span>
					</h2>
				)}

				<h2 className={styles.header}>
					<span className={styles.headerTitle}>Filter{!hasFilter && ':'}</span>
					{!hasFilter && <span>All request</span>}
				</h2>
				{hasFilter && <RuleViewerFilter filter={filter} />}

				<h2 className={styles.header}>
					<span className={styles.headerTitle}>Action:</span>
					<span className={styles.headerData}>{ruleActionsTypeHumanTitles[action.type]}</span>
				</h2>

				{action.type === RuleActionsType.Mutation && <RuleViewerActionMutation action={action} />}

				{action.type === RuleActionsType.LocalResponse && <RuleViewerActionLocalResponse action={action} />}

				{action.type === RuleActionsType.Failure && <RuleViewerActionFailure action={action} />}
			</div>
		</div>
	);
});
