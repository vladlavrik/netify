import React, {memo, useCallback} from 'react';
import {hideRuleDetails} from '@/stores/uiStore';
import {IconButton} from '@/components/@common/buttons/IconButton';
import CloseIcon from './icons/close.svg';
import styles from './RuleViewerHeader.css';

export const RuleViewerHeader = memo(function RuleViewerHeader() {
	const handleClose = useCallback(() => hideRuleDetails(), []);

	return (
		<div className={styles.root}>
			<IconButton
				className={styles.closeButton}
				icon={<CloseIcon />}
				tooltip='Close details'
				onClick={handleClose}
			/>
			<p className={styles.title}>Rule details</p>
		</div>
	);
});
