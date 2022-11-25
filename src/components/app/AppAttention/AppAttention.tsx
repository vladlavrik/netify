import React from 'react';
import {observer} from 'mobx-react-lite';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {useStores} from '@/stores/useStores';
import AttentionIcon from './icons/attention.svg';
import ClearIcon from './icons/clear.svg';
import styles from './appAttention.css';

export const AppAttention = observer(() => {
	const {attentionsStore} = useStores();
	const {currentMessage} = attentionsStore;

	const handleClearCurrent = () => {
		attentionsStore.cleanCurrent();
	};

	if (!currentMessage) {
		return null;
	}
	return (
		<section className={styles.root}>
			<AttentionIcon className={styles.icon} />
			<div className={styles.body}>{currentMessage}</div>
			<IconButton className={styles.clearButton} icon={<ClearIcon />} onClick={handleClearCurrent} />
		</section>
	);
});

AppAttention.displayName = 'AppAttention';
