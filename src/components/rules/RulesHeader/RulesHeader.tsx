import React, {Fragment, useCallback, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useCompactModeCondition} from '@/hooks/useCompactModeCondition';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {TextButton} from '@/components/@common/buttons/TextButton';
import {SectionHeader} from '@/components/@common/misc/SectionHeader';
import {PopUpConfirm} from '@/components/@common/popups/PopUpConfirm';
import {useStores} from '@/stores/useStores';
import AddIcon from './icons/add.svg';
import CancelIcon from './icons/cancel.svg';
import ClearIcon from './icons/clear.svg';
import CollapseIcon from './icons/collapse.svg';
import DoneIcon from './icons/done.svg';
import ExpandIcon from './icons/expand.svg';
import styles from './rulesHeader.css';

export const RulesHeader = observer(() => {
	const {appUiStore, rulesStore} = useStores();
	const secondarySectionCollapsed = appUiStore.secondarySectionCollapsed;
	const hasRules = rulesStore.hasActiveRules;
	const isAllSelected = rulesStore.isAllRulesSelected;
	const exportMode = rulesStore.exportMode;

	const isCompactMode = useCompactModeCondition();

	const [showRemoveAllAsk, setShowRemoveAllAsk] = useState(false);

	const handleComposeShow = () => {
		rulesStore.showCompose();
	};

	const handleSelectAllSwitch = () => {
		if (isAllSelected) {
			rulesStore.unselectAll();
		} else {
			rulesStore.selectAll();
		}
	};

	const handleExportCommit = () => {
		rulesStore.exportRules();
	};

	const handleExportCancel = () => {
		rulesStore.finishExport();
	};

	const handleToggleSecondarySectionCollapsed = () => {
		appUiStore.toggleSecondarySectionCollapse();
	};

	const handleRemoveAllAsk = useCallback(() => setShowRemoveAllAsk(true), []);

	const handleRemoveAllCancel = useCallback(() => setShowRemoveAllAsk(false), []);
	const handleRemoveAllConfirm = useCallback(async () => {
		rulesStore.removeAllRules();
		setShowRemoveAllAsk(false);
	}, []);

	return (
		<>
			<SectionHeader
				title={
					exportMode ? (
						<span className={styles.activeTitle}>
							Select rules to export{' '}
							<TextButton onClick={handleSelectAllSwitch}>
								{isAllSelected ? 'Unselect all' : 'Select all'}
							</TextButton>
						</span>
					) : (
						'Rules'
					)
				}>
				{exportMode ? (
					<Fragment key={'export-controls' /* The key used to avoid miss focus after cancel export mode */}>
						<IconButton className={styles.control} icon={<DoneIcon />} onClick={handleExportCommit}>
							Export
						</IconButton>
						<IconButton className={styles.control} icon={<CancelIcon />} onClick={handleExportCancel}>
							Cancel
						</IconButton>
					</Fragment>
				) : (
					<>
						<IconButton
							className={styles.control}
							icon={<AddIcon />}
							tooltip='Add a new rule'
							onClick={handleComposeShow}
						/>
						<IconButton
							className={styles.control}
							icon={<ClearIcon />}
							tooltip='Clear all rules'
							disabled={!hasRules}
							onClick={handleRemoveAllAsk}
						/>
					</>
				)}

				{!isCompactMode && (
					<>
						<div className={styles.separator} />

						<IconButton
							className={styles.control}
							icon={secondarySectionCollapsed ? <ExpandIcon /> : <CollapseIcon />}
							onClick={handleToggleSecondarySectionCollapsed}
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

RulesHeader.displayName = 'RulesHeader';
