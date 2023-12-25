import React from 'react';
import {observer} from 'mobx-react-lite';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {SectionHeader} from '@/components/@common/misc/SectionHeader';
import {useStores} from '@/stores/useStores';
import ClearIcon from './icons/clear.svg';

export const ErrorLogsHeader = observer(() => {
	const {errorLogsStore} = useStores();
	const {hasLogs} = errorLogsStore;

	const handleClean = () => {
		errorLogsStore.cleanList();
	};

	return (
		<SectionHeader title='Error log'>
			<IconButton icon={<ClearIcon />} tooltip='Clear log' disabled={!hasLogs} onClick={handleClean} />
		</SectionHeader>
	);
});

ErrorLogsHeader.displayName = 'ErrorLogsHeader';
