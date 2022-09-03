import React, {memo} from 'react';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {useStores} from '@/stores/useStores';
import CloseIcon from './icons/close.svg';
import styles from './ruleViewerHeader.css';

export const RuleViewerHeader = memo(() => {
	const {rulesStore} = useStores();

	const handleClose = () => {
		rulesStore.closeDetails();
	};

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

RuleViewerHeader.displayName = 'RuleViewerHeader';
