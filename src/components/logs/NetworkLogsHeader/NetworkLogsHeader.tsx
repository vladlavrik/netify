import React from 'react';
import {observer} from 'mobx-react-lite';
import {useStores} from '@/stores/useStores';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {Dropdown} from '@/components/@common/misc/Dropdown';
import {SectionHeader} from '@/components/@common/misc/SectionHeader';
import {NetworkLogShowControls} from '@/components/logs/NetworkLogShowControls';
import ClearIcon from '@/assets/icons/clear.svg';
import EyeIcon from '@/assets/icons/eye.svg';
import styles from './networkLogsHeader.css';

export const NetworkLogsHeader = observer(() => {
	const {networkLogsStore} = useStores();
	const {hasLogs} = networkLogsStore;

	const handleClean = () => {
		networkLogsStore.cleanList();
	};

	return (
		<SectionHeader
			title='Network logs'
			trailing={
				<>
					<Dropdown
						className={styles.control}
						render={(dropdownProps, {expanded}) => (
							<IconButton
								{...dropdownProps}
								icon={<EyeIcon />}
								tooltip={'Log show configuration'}
								tooltipDisabled={expanded}
								active={expanded}
							/>
						)}
						content={<NetworkLogShowControls />}
					/>
					<IconButton
						className={styles.control}
						icon={<ClearIcon />}
						tooltip='Clear log'
						disabled={!hasLogs}
						onClick={handleClean}
					/>
				</>
			}
		/>
	);
});

NetworkLogsHeader.displayName = 'NetworkLogsHeader';
