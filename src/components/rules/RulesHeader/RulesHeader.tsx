import React, {memo, useCallback, useContext, useState} from 'react';
import {useStore} from 'effector-react';
import {DbContext} from '@/contexts/dbContext';
import {$secondarySectionCollapsed, $useRulesPerDomain, toggleSecondarySectionCollapse, showCompose} from '@/stores/uiStore'; // prettier-ignore
import {$hasRules, removeAllRules} from '@/stores/rulesStore';
import {useCompactModeCondition} from '@/hooks/useCompactModeCondition';
import {SectionHeader} from '@/components/@common/misc/SectionHeader';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {PopUpConfirm} from '@/components/@common/popups/PopUpConfirm';
import AddIcon from './icons/add.svg';
import ClearIcon from './icons/clear.svg';
import CollapseIcon from './icons/collapse.svg';
import ExpandIcon from './icons/expand.svg';
import styles from './rulesHeader.css';

export const RulesHeader = memo(function RulesHeader() {
	const {rulesMapper} = useContext(DbContext)!;

	const hasRules = useStore($hasRules);
	const secondarySectionCollapsed = useStore($secondarySectionCollapsed);

	const isCompactMode = useCompactModeCondition();

	const [showRemoveAllAsk, setShowRemoveAllAsk] = useState(false);

	const handleShowCompose = useCallback(() => showCompose(), []);
	const handleRemoveAllAsk = useCallback(() => setShowRemoveAllAsk(true), []);
	const handleToggleSectionCollapsed = useCallback(() => toggleSecondarySectionCollapse(), []);

	const handleRemoveAllCancel = useCallback(() => setShowRemoveAllAsk(false), []);
	const handleRemoveAllConfirm = useCallback(async () => {
		const perCurrentOrigin = $useRulesPerDomain.getState();
		await removeAllRules({rulesMapper, perCurrentOrigin});
		setShowRemoveAllAsk(false);
	}, []);

	return (
		<>
			<SectionHeader title='Rules'>
				<IconButton
					className={styles.control}
					icon={<AddIcon />}
					tooltip='Add a new rule'
					onClick={handleShowCompose}
				/>
				<IconButton
					className={styles.control}
					icon={<ClearIcon />}
					tooltip='Clear all rules'
					disabled={!hasRules}
					onClick={handleRemoveAllAsk}
				/>

				{!isCompactMode && (
					<>
						<div className={styles.separator} />

						<IconButton
							className={styles.control}
							icon={secondarySectionCollapsed ? <ExpandIcon /> : <CollapseIcon />}
							onClick={handleToggleSectionCollapsed}
						/>
					</>
				)}
			</SectionHeader>

			{showRemoveAllAsk && (
				<PopUpConfirm onConfirm={handleRemoveAllConfirm} onCancel={handleRemoveAllCancel}>
					Clear all rules forever?
				</PopUpConfirm>
			)}
		</>
	);
});
