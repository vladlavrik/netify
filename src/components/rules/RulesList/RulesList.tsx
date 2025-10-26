import React, {useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {useMultiselectRange} from '@/hooks/useMultiselectRange';
import {TextButton} from '@/components/@common/buttons/TextButton';
import {useStores} from '@/stores/useStores';
import {RulesItem} from '../RulesItem';
import styles from './rulesList.css';

const getRuleId = (rule: {id: string}) => rule.id;

export const RulesList = observer(() => {
	const {rulesStore} = useStores();

	const rules = rulesStore.list;
	const highlightedId = rulesStore.detailsShownFor;
	const {multiselectMode, selectedIds, hasSelectedRules} = rulesStore;
	const rulesCount = rules.length;

	const getSelectedRange = useMultiselectRange(rules, getRuleId, hasSelectedRules);

	const handleSelect = useCallback((ruleId: string, selected: boolean, range: boolean) => {
		const ids = getSelectedRange(ruleId, range);
		if (selected) {
			rulesStore.selectItems(ids);
		} else {
			rulesStore.unselectItems(ids);
		}
	}, []);

	const handleShowCompose = () => {
		rulesStore.showCompose();
	};

	return rulesCount === 0 ? (
		<div className={styles.placeholder}>
			No rules yet
			<TextButton className={styles.composeButton} styleType='raised' onClick={handleShowCompose}>
				Compose a first rule
			</TextButton>
		</div>
	) : (
		<ul>
			{rules.map((rule, index) => (
				<RulesItem
					key={rule.id}
					data={rule}
					isStartEdgePosition={index === 0}
					isEndEdgePosition={index === rulesCount - 1}
					isHighlighted={rule.id === highlightedId}
					isExportMode={multiselectMode}
					isSelected={selectedIds.has(rule.id)}
					onSelect={handleSelect}
				/>
			))}
		</ul>
	);
});

RulesList.displayName = 'RulesList';
