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
				tooltip={chrome.i18n.getMessage(debuggingActive ? 'stopRequestsListening' : 'startRequestsListening')}
				icon={debuggingActive ? <ListeningActiveIcon /> : <ListeningInactiveIcon />}
				onClick={handleToggleEnabled}>
				{!debuggingSwitching && debuggingActive && chrome.i18n.getMessage('listening')}
				{!debuggingSwitching && !debuggingActive && chrome.i18n.getMessage('inactive')}
				{debuggingSwitching && debuggingActive && chrome.i18n.getMessage('stopping')}
				{debuggingSwitching && !debuggingActive && chrome.i18n.getMessage('starting')}
			</IconButton>

			<div className={styles.separator} />

			<WithTooltip
				tooltip={
					<span>
						{chrome.i18n.getMessage('ifCheckedOnlyRulesCreatedWithin')}
						<br />
						{chrome.i18n.getMessage('theCurrentPageOriginWillBeShown')}
						<br />
						{chrome.i18n.getMessage('inTheListOfRules')}
					</span>
				}>
				<Checkbox
					className={styles.mainControl}
					checked={useRulesPerDomain}
					onChange={handleToggleFilterByOrigin}>
					{chrome.i18n.getMessage('rulesPerSite')}
				</Checkbox>
			</WithTooltip>

			{!isCompactMode && false /* TODO waiting for feature implementation */ && (
				<WithTooltip
					tooltip={
						<span>
							{chrome.i18n.getMessage('ifCheckedRequestsWillBeLogged')}
							<br />
							{chrome.i18n.getMessage('notJustThoseAffectedByTheRules')}
						</span>
					}>
					<Checkbox
						className={styles.mainControl}
						checked={logAllRequest}
						onChange={handleToggleLogAllRequest}>
						{chrome.i18n.getMessage('logAllRequests')}
					</Checkbox>
				</WithTooltip>
			)}

			<div className={styles.separator} />

			<IconFileButton
				className={styles.additionalControl}
				icon={<ImportIcon />}
				disabled={isExportMode}
				tooltip={chrome.i18n.getMessage('importRules')}
				accept='.json'
				onFileSelect={handleImport}
			/>

			<IconButton
				className={styles.additionalControl}
				icon={<ExportIcon />}
				disabled={isExportMode || !hasAnyRules}
				tooltip={chrome.i18n.getMessage('exportRules')}
				onClick={handleInitExport}
			/>

			<div className={styles.tail}>
				<Dropdown
					render={(dropdownProps) => (
						<IconButton
							{...dropdownProps}
							icon={<RateIcon />}
							tooltip={chrome.i18n.getMessage('rateAndSupportUs')}
						/>
					)}
					preferExpansionAlignX='end'
					content={<AppRateBanner />}
				/>
			</div>
		</header>
	);
});

AppHeader.displayName = 'AppHeader';
