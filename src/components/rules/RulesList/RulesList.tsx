import React from 'react';
import {observer} from 'mobx-react-lite';
import {Button} from '@/components/@common/buttons/Button';
import {useStores} from '@/stores/useStores';
import {RulesItem} from '../RulesItem';
import styles from './rulesList.css';

export const RulesList = observer(() => {
	const {rulesStore} = useStores();

	const rules = rulesStore.list;
	const highlightedId = rulesStore.detailsShownFor;
	const {exportMode, selectedIds} = rulesStore;
	const rulesCount = rules.length;

	const handleShowCompose = () => {
		rulesStore.showCompose();
	};

	return rulesCount === 0 ? (
		<div className={styles.placeholder}>
			{chrome.i18n.getMessage('noRulesYet')}
			<Button className={styles.composeButton} onClick={handleShowCompose}>
				{chrome.i18n.getMessage('composeFirstRule')}
			</Button>
		</div>
	) : (
		<ul className={styles.list}>
			{rules.map((rule, index) => (
				<RulesItem
					key={rule.id}
					data={rule}
					isStartEdgePosition={index === 0}
					isEndEdgePosition={index === rulesCount - 1}
					isHighlighted={rule.id === highlightedId}
					isExportMode={exportMode}
					isSelected={selectedIds.includes(rule.id)}
				/>
			))}
		</ul>
	);
});

RulesList.displayName = 'RulesList';
