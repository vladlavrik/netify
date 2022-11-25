import React, {useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {useCompactModeCondition} from '@/hooks/useCompactModeCondition';
import {IconButton} from '@/components/@common/buttons/IconButton';
import {IconFileButton} from '@/components/@common/buttons/IconFileButton';
import {Checkbox} from '@/components/@common/forms/Checkbox';
import {Dropdown} from '@/components/@common/misc/Dropdown';
import {WithTooltip} from '@/components/@common/misc/WithTooltip';
import {useStores} from '@/stores/useStores';
import {AppRateBanner} from '../AppRateBanner';
import ExportIcon from './icons/export.svg';
import ImportIcon from './icons/import.svg';
import ListeningActiveIcon from './icons/listening-active.svg';
import ListeningInactiveIcon from './icons/listening-inactive.svg';
import RateIcon from './icons/rate.svg';
import styles from './appHeader.css';

export const AppHeader = observer(() => {
	const {debuggerStateStore, rulesStore, logsStore} = useStores();

	const debuggingActive = debuggerStateStore.active;
	const debuggingSwitching = debuggerStateStore.switching;
	const hasAnyRules = rulesStore.hasAnyRules;
	const hasActiveRules = rulesStore.hasActiveRules;
	const isExportMode = rulesStore.exportMode;
	const useRulesPerDomain = rulesStore.filterByOrigin;
	const logAllRequest = logsStore.logAllRequest;

	const isCompactMode = useCompactModeCondition();

	const handleToggleEnabled = () => {
		if (!debuggingSwitching) {
			debuggerStateStore.toggleEnabled();
		}
	};

	const handleToggleFilterByOrigin = () => {
		rulesStore.toggleFilterByOrigin();
	};

	const handleInitExport = () => {
		rulesStore.initExport();
	};

	const handleImport = useCallback((files: FileList) => {
		rulesStore.importRules(files[0]);
	}, []);

	const handleToggleLogAllRequest = () => {
		logsStore.toggleLogAllRequest();
	};

	return (
		<header className={styles.root}>
			<IconButton
				className={styles.debuggerSwitcher}
				disabled={!hasActiveRules}
				tooltip={debuggingActive ? 'Stop requests listening' : 'Start requests listening'}
				icon={debuggingActive ? <ListeningActiveIcon /> : <ListeningInactiveIcon />}
				onClick={handleToggleEnabled}>
				{!debuggingSwitching && debuggingActive && 'Listening'}
				{!debuggingSwitching && !debuggingActive && 'Inactive'}
				{debuggingSwitching && debuggingActive && 'Stopping'}
				{debuggingSwitching && !debuggingActive && 'Starting'}
			</IconButton>

			<div className={styles.separator} />

			<WithTooltip
				tooltip={
					<span>
						If checked - only rules created within
						<br />
						the current page origin will be shown
						<br />
						in the list of rules.
					</span>
				}>
				<Checkbox
					className={styles.mainControl}
					checked={useRulesPerDomain}
					onChange={handleToggleFilterByOrigin}>
					Rules per site
				</Checkbox>
			</WithTooltip>

			{!isCompactMode && false /* TODO waiting for feature implementation */ && (
				<WithTooltip
					tooltip={
						<span>
							If checked - all requests will be logged,
							<br />
							not just those affected by the rules.
						</span>
					}>
					<Checkbox
						className={styles.mainControl}
						checked={logAllRequest}
						onChange={handleToggleLogAllRequest}>
						Log all requests
					</Checkbox>
				</WithTooltip>
			)}

			<div className={styles.separator} />

			<IconFileButton
				className={styles.additionalControl}
				icon={<ImportIcon />}
				disabled={isExportMode}
				tooltip='Import rules'
				accept='.json'
				onFileSelect={handleImport}
			/>

			<IconButton
				className={styles.additionalControl}
				icon={<ExportIcon />}
				disabled={isExportMode || !hasAnyRules}
				tooltip='Export rules'
				onClick={handleInitExport}
			/>

			<div className={styles.tail}>
				<Dropdown
					render={(dropdownProps) => (
						<IconButton {...dropdownProps} icon={<RateIcon />} tooltip={'Rate and support us'} />
					)}
					preferExpansionAlignX='end'
					content={<AppRateBanner />}
				/>
			</div>
		</header>
	);
});

AppHeader.displayName = 'AppHeader';
