import React from 'react';
import {observer} from 'mobx-react-lite';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {SectionHeader} from '@/components/@common/misc/SectionHeader';
import {useStores} from '@/stores/useStores';
import ClearIcon from './icons/clear.svg';

export const NetworkLogsHeader = observer(() => {
	const {networkLogsStore} = useStores();
	const {hasLogs} = networkLogsStore;

	const handleClean = () => {
		networkLogsStore.cleanList();
	};

	return (
		<SectionHeader title='Network logs'>
			<IconButton icon={<ClearIcon />} tooltip='Clear log' disabled={!hasLogs} onClick={handleClean} />
		</SectionHeader>
	);
});

NetworkLogsHeader.displayName = 'NetworkLogsHeader';
