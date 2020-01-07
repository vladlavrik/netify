import React, {memo, useContext, useState, useRef, useCallback, useEffect} from 'react';
import {useList, useStore} from 'effector-react';
import classNames from 'classnames';
import {DbContext} from '@/contexts/dbContext';
import {$hasRules, $rules, removeRule} from '@/stores/rulesStore';
import {$highlightedRuleId, showCompose, showRuleEditor, resetHighlightedRule} from '@/stores/uiStore';
import {Button} from '@/components/@common/buttons/Button';
import {PopUpConfirm} from '@/components/@common/popups/PopUpConfirm';
import {RulesItem} from '../RulesItem';
import {RulesDetails} from '../RulesDetails/RulesDetails';
import styles from './rulesList.css';

export const RulesList = memo(() => {
	const {dbRulesMapper} = useContext(DbContext)!;

	const hasRules = useStore($hasRules);
	const highlightedId = useStore($highlightedRuleId);
	const [showRemoveAskFor, setShowRemoveAskFor] = useState<string | null>(null);

	const highlightedItemRef = useRef<HTMLLIElement>(null);

	const handleShowCompose = useCallback(() => showCompose(), []);

	const handleHighlightFinish = useCallback(() => resetHighlightedRule(), []);

	const handleEdit = useCallback((ruleId: string) => showRuleEditor(ruleId), []);

	const handleRemoveCancel = useCallback(() => setShowRemoveAskFor(null), []);
	const handleRemoveConfirm = useCallback(async () => {
		await removeRule({dbRulesMapper, ruleId: showRemoveAskFor!});
		setShowRemoveAskFor(null);
	}, [showRemoveAskFor]);

	useEffect(() => {
		if (highlightedId && highlightedItemRef.current) {
			highlightedItemRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}
	}, [highlightedId]);

	const list = useList($rules, {
		keys: [highlightedId, handleHighlightFinish, handleEdit, setShowRemoveAskFor],
		fn: rule => ( // eslint-disable-line
			<li
				key={rule.id}
				ref={rule.id === highlightedId ? highlightedItemRef : null}
				className={classNames(styles.item, rule.id === highlightedId && styles.highlighted)}
				onAnimationEnd={handleHighlightFinish}>
				<RulesItem data={rule} onEdit={handleEdit} onRemove={setShowRemoveAskFor}>
					<RulesDetails data={rule} />
				</RulesItem>
			</li>
		),
	});

	return (
		<>
			{hasRules ? (
				list
			) : (
				<p className={styles.placeholder}>
					No rules yet
					<Button className={styles.composeButton} onClick={handleShowCompose}>
						Compose a first rule
					</Button>
				</p>
			)}

			{showRemoveAskFor && (
				<PopUpConfirm onConfirm={handleRemoveConfirm} onCancel={handleRemoveCancel}>
					Remove the rule forever?
				</PopUpConfirm>
			)}
		</>
	);
});

RulesList.displayName = 'RulesList';
