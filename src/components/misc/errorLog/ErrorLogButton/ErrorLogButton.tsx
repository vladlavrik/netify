import React, {useEffect, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {useStores} from '@/stores/useStores';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {Dropdown, DropdownRef} from '@/components/@common/misc/Dropdown';
import {ErrorLog} from '../ErrorLog';
import ErrorIcon from './icons/error.svg';

export const ErrorLogButton = observer(() => {
	const {errorLogsStore} = useStores();
	const {hasLogs} = errorLogsStore;

	const dropdownRef = useRef<DropdownRef>(null);

	// Auto expand in some log appears
	useEffect(() => {
		if (hasLogs) {
			dropdownRef.current!.expand();
		}
	}, [hasLogs]);

	if (!hasLogs) {
		return null;
	}

	return (
		<Dropdown
			ref={dropdownRef}
			render={(dropdownProps, {expanded}) => (
				<IconButton
					{...dropdownProps}
					icon={<ErrorIcon />}
					styleType='dangerous'
					tooltip='Error log'
					tooltipDisabled={expanded}
				/>
			)}
			content={({collapse}) => <ErrorLog onClose={collapse} />}
		/>
	);
});

ErrorLogButton.displayName = 'ErrorLogButton';
