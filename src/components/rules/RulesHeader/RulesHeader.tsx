import React, {memo, useCallback, useContext, useState} from 'react';
import {useStore} from 'effector-react';
import cn from 'classnames';
import {DbContext} from '@/contexts/dbContext';
import {$secondarySectionCollapsed, $useRulesPerDomain, toggleSecondarySectionCollapse, showCompose} from '@/stores/uiStore'; // prettier-ignore
import {$hasRules, removeAllRules} from '@/stores/rulesStore';
import {useCompactModeCondition} from '@/hooks/useCompactModeCondition';
import {SectionHeader} from '@/components/@common/misc/SectionHeader';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {PopUpConfirm} from '@/components/@common/popups/PopUpConfirm';
import styles from './rulesHeader.css';

export const RulesHeader = memo(function RulesHeader() {
	const {dbRulesMapper} = useContext(DbContext)!;

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
		await removeAllRules({dbRulesMapper, perCurrentOrigin});
		setShowRemoveAllAsk(false);
	}, []);

	return (
		<>
			<SectionHeader title='Rules'>
				<IconButton
					className={cn(styles.control, styles.add)}
					tooltip='Add a new rule'
					onClick={handleShowCompose}
				/>
				<IconButton
					className={cn(styles.control, styles.clear)}
					disabled={!hasRules}
					tooltip='Clear all rules'
					onClick={handleRemoveAllAsk}
				/>

				{!isCompactMode && (
					<>
						<div className={styles.separator} />

						<IconButton
							className={cn(styles.control, secondarySectionCollapsed ? styles.expand : styles.collapse)}
							tooltip={secondarySectionCollapsed ? 'Expand logs' : 'Collapse logs'}
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
