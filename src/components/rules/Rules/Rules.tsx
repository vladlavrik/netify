import React, {memo, useCallback, useContext, useState} from 'react';
import {useStore} from 'effector-react';
import classNames from 'classnames';
import {DbContext} from '@/contexts/dbContext';
import {$debuggerActive, showCompose, toggleDebuggerEnabled} from '@/stores/uiStore';
import {$hasRules, removeAllRules} from '@/stores/rulesStore';
import {SectionHeader} from '@/components/@common/misc/SectionHeader';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {PopUpConfirm} from '@/components/@common/popups/PopUpConfirm';
import {RulesList} from '@/components/rules/RulesList';
import styles from './rules.css';

export const Rules = memo(() => {
	const {dbRulesMapper} = useContext(DbContext)!;

	const debuggerActive = useStore($debuggerActive);
	const hasRules = useStore($hasRules);

	const [showRemoveAllAsk, setShowRemoveAllAsk] = useState(false);

	const handleShowCompose = useCallback(() => showCompose(), []);
	const handleRemoveAllAsk = useCallback(() => setShowRemoveAllAsk(true), []);
	const handleToggleDebuggerEnabled = useCallback(() => toggleDebuggerEnabled(), []);

	const handleRemoveAllCancel = useCallback(() => setShowRemoveAllAsk(false), []);
	const handleRemoveAllConfirm = useCallback(async () => {
		await removeAllRules({dbRulesMapper});
		setShowRemoveAllAsk(false);
	}, []);

	return (
		<div className={styles.root}>
			<SectionHeader title='Rules'>
				<IconButton
					className={classNames(styles.control, styles.typeAdd)}
					tooltip='Add a new rule'
					onClick={handleShowCompose}
				/>
				<IconButton
					className={classNames(
						styles.control,
						debuggerActive ? styles.typeStopListen : styles.typeStartListen,
					)}
					disabled={!hasRules}
					tooltip={debuggerActive ? 'Disable debugger' : 'Enable debugger'}
					onClick={handleToggleDebuggerEnabled}
				/>
				<IconButton
					className={classNames(styles.control, styles.typeClear)}
					disabled={!hasRules}
					tooltip='Clear all rules'
					onClick={handleRemoveAllAsk}
				/>
			</SectionHeader>

			<div className={styles.content}>
				<RulesList />
			</div>

			{showRemoveAllAsk && (
				<PopUpConfirm onConfirm={handleRemoveAllConfirm} onCancel={handleRemoveAllCancel}>
					Clear all rules forever?
				</PopUpConfirm>
			)}
		</div>
	);
});

Rules.displayName = 'Rules';
