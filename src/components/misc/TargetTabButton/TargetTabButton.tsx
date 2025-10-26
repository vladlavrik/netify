import React from 'react';
import {observer} from 'mobx-react-lite';
import {useStores} from '@/stores/useStores';
import {IconButton} from '@/components/@common/buttons/IconButton';
import TargetIcon from '@/assets/icons/target.svg';
import styles from './targetTabButton.css';

export const TargetTabButton = observer(() => {
	const {tabStore} = useStores();

	const {targetTab} = tabStore;

	if (!targetTab) {
		return null;
	}

	const handleFocus = () => {
		tabStore.focusTargetTab();
	};

	return (
		<IconButton
			icon={<TargetIcon />}
			tooltipStyled={false}
			tooltip={
				<div className={styles.hint}>
					<p className={styles.hintIntro}>Focus target tab</p>
					<div className={styles.hintTabBlock}>
						{targetTab.favIconUrl && (
							<img className={styles.hintTabIcon} src={targetTab.favIconUrl} alt='Favicon' />
						)}
						<div>
							<p className={styles.hintTabValue}>{targetTab.title}</p>
							<p className={styles.hintTabValue}>{targetTab.url}</p>
						</div>
					</div>
				</div>
			}
			onClick={handleFocus}
		/>
	);
});

TargetTabButton.displayName = 'TargetTab';
