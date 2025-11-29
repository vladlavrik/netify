import React from 'react';
import {observer} from 'mobx-react-lite';
import {useStores} from '@/stores/useStores';
import {RadioButton} from '@/components/@common/forms/RadioButton';
import styles from './networkLogShowControls.css';

export const NetworkLogShowControls = observer(() => {
	const {settingsStore} = useStores();

	const logOnlyAffected = settingsStore.values.networkLogOnlyAffected;

	const handleLogFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		settingsStore.updateValues({networkLogOnlyAffected: event.target.value === 'only-affected'});
	};

	return (
		<div className={styles.root}>
			<RadioButton
				className={styles.radioOption}
				name='network-log-show'
				value='all'
				checked={!logOnlyAffected}
				onChange={handleLogFilterChange}>
				Show all requests
			</RadioButton>
			<RadioButton
				className={styles.radioOption}
				name='network-log-show'
				value='only-affected'
				checked={logOnlyAffected}
				onChange={handleLogFilterChange}>
				Show only affected requests
			</RadioButton>
		</div>
	);
});

NetworkLogShowControls.displayName = 'NetworkLogItemControls';
