import React, {memo, useCallback} from 'react';
import {useList, useStore} from 'effector-react';
import {$hasRules, $rulesCount, $rules} from '@/stores/rulesStore';
import {showCompose, showRuleDetails, $ruleDetailsShownFor} from '@/stores/uiStore';
import {Button} from '@/components/@common/buttons/Button';
import {RulesItem} from '../RulesItem';
import styles from './rulesList.css';

export const RulesList = memo(() => {
	const hasRules = useStore($hasRules);
	const highlightedId = useStore($ruleDetailsShownFor);
	const rulesCount = useStore($rulesCount);

	const handleShowCompose = useCallback(() => showCompose(), []);

	const listNode = useList($rules, {
		keys: [highlightedId, rulesCount],

		// eslint-disable-next-line react/display-name
		fn: (rule, index) => (
			<RulesItem
				key={rule.id}
				data={rule}
				isStartEdgePosition={index === 0}
				isEndEdgePosition={index === rulesCount - 1}
				isHighlighted={rule.id === highlightedId}
				onShowDetails={showRuleDetails}
			/>
		),
	});

	return hasRules ? (
		<ul className={styles.list}>{listNode}</ul>
	) : (
		<div className={styles.placeholder}>
			No rules yet
			<Button className={styles.composeButton} onClick={handleShowCompose}>
				Compose a first rule
			</Button>
		</div>
	);
});

RulesList.displayName = 'RulesList';
