import React from 'react';
import {observer} from 'mobx-react-lite';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {SectionHeader} from '@/components/@common/misc/SectionHeader';
import {useStores} from '@/stores/useStores';
import ClearIcon from './icons/clear.svg';

export const LogsHeader = observer(() => {
	const {logsStore} = useStores();
	const {hasLogs} = logsStore;

	const handleClean = () => {
		logsStore.cleanList();
	};

	return (
		<SectionHeader title={chrome.i18n.getMessage('log')}>
			<IconButton
				icon={<ClearIcon />}
				tooltip={chrome.i18n.getMessage('clearLog')}
				disabled={!hasLogs}
				onClick={handleClean}
			/>
		</SectionHeader>
	);
});

LogsHeader.displayName = 'LogsHeader';
